import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';
import { RootState } from '../store';
import { PAGE_SIZE } from '../../config/config';

interface PaymentAttributes {
  id: string | number;
  name: string;
  avatar?: string;
}

interface PendingPaymentAttributes extends PaymentAttributes {
  due: number;
}

interface PreviousPaymentAttributes {
  id: string | number;
  playerId: string | number;
  player: PaymentAttributes;
  amount: number;
  createdAt: string;
}

interface PaymentPlanAttributes {
  id?: number | string;
  effectiveFrom: {
    year: number;
    month: number;
  };
  fee: number | string;
}

interface PaymentPlans {
  onGoing: PaymentPlanAttributes;
  future: PaymentPlanAttributes;
}

interface CollectionAttributes {
  projected: number;
  received: number;
  due: number;
}

interface PaymentSliceState {
  previousPaymentsTotal: number;
  pendingPayments: PendingPaymentAttributes[];
  previousPayments: PreviousPaymentAttributes[];
  paymentPlans: PaymentPlans;
  collection: CollectionAttributes;
}

interface NewPayment {
  id: number | string;
  values: {
    amount: number | string;
  };
}

interface UpdatePayment {
  id: number | string;
  data: NewPayment;
}

export const getPendingPayments = createAsyncThunk(
  'payment/pending',
  async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const response: any = await api.get(
      `/payments/dues?month=${month}&year=${year}`
    );
    if (response.ok) {
      return response.data?.duePlayers || [];
    }

    return [];
  }
);

export const getPreviousPayments = createAsyncThunk(
  'payment/previous',
  async (offset: number, { getState, rejectWithValue }) => {
    if (
      !offset ||
      (getState() as RootState).payment.previousPayments.length <
        (getState() as RootState).payment.previousPaymentsTotal
    ) {
      const response: any = await api.get(
        `/payments?limit=${PAGE_SIZE}&offset=${offset}`
      );
      if (response.ok) {
        return {
          payments: response.data?.payments || [],
          offset,
          total: response.data?.totalCount,
        };
      }

      return {
        payments: [],
        offset,
        total: (getState() as RootState).payment.previousPaymentsTotal,
      };
    }

    return rejectWithValue('End of the list reached.');
  }
);

export const getPaymentPlans = createAsyncThunk('payment/plan', async () => {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const response: any = await api.get(
    `/payments/plans?month=${month}&year=${year}`
  );

  if (response.ok) {
    return {
      onGoing: response.data?.onGoingPlan,
      future: response.data?.futurePlan,
    };
  }

  return {
    onGoing: null,
    future: null,
  };
});

export const getCollectionDetails = createAsyncThunk(
  'payment/collection',
  async (payload: { year: number; month: number }) => {
    const response: any = await api.get(
      `/payments/projections?month=${payload.month}&year=${payload.year}`
    );

    if (response.ok) {
      return {
        projected: response.data?.projected || 0,
        received: response.data?.projected - response.data?.due || 0,
        due: response.data?.due || 0,
      };
    }

    return {
      projected: 0,
      received: 0,
      due: 0,
    };
  }
);

export const createPayments = createAsyncThunk(
  'payment/createPayment',
  async (payload: { details: NewPayment[] }, { rejectWithValue, getState }) => {
    const response: any = await api.post('/payments', payload);
    if (response.ok) {
      return response.data.payment.map((payment: any) => ({
        ...payment,
        player: (getState() as RootState).player.players.find(
          (player) => player.id === payment.playerId
        ),
      }));
    }

    return rejectWithValue('Payments creation failed.');
  }
);

export const deletePayment = createAsyncThunk(
  'payment/deletePayment',
  async (payload: number | string, { dispatch, rejectWithValue }) => {
    const response: any = await api.delete(`/payments/${payload}`);
    if (response.ok) {
      dispatch(getPendingPayments());
      dispatch(getPreviousPayments(0));
      return payload;
    }

    return rejectWithValue('Payment deletion failed.');
  }
);

export const updatePayment = createAsyncThunk(
  'payment/updatePayment',
  async (payload: UpdatePayment, { rejectWithValue }) => {
    const response: any = await api.put(`/payments/${payload.id}`, {
      id: payload.data.id,
      amount: payload.data.values.amount,
    });
    if (response.ok) {
      return payload;
    }

    return rejectWithValue('Payment update failed.');
  }
);

export const createPlan = createAsyncThunk(
  'payment/createPlan',
  async (payload: PaymentPlanAttributes, { rejectWithValue }) => {
    const response: any = await api.post('payments/plans', payload);
    if (response.ok) {
      return payload;
    }

    return rejectWithValue('Failed to create payment plan.');
  }
);

export const updatePlan = createAsyncThunk(
  'payment/updatePlan',
  async (
    payload: {
      id: number | string;
      type: 'ongoing' | 'future';
      data: PaymentPlanAttributes;
    },
    { rejectWithValue }
  ) => {
    const response: any = await api.put(
      `payments/plans/${payload.id}`,
      payload.data
    );
    if (response.ok) {
      return payload;
    }

    return rejectWithValue('Failed to update payment plan.');
  }
);

export const deletePlan = createAsyncThunk(
  'payment/deletePlan',
  async (payload: number | string, { rejectWithValue }) => {
    const response: any = await api.delete(`payments/plans/${payload}`);
    if (response.ok) {
      return;
    }

    return rejectWithValue('Failed to delete payment plan.');
  }
);

const initialState: PaymentSliceState = {
  previousPaymentsTotal: 0,
  pendingPayments: [],
  previousPayments: [],
  paymentPlans: {
    onGoing: null,
    future: null,
  },
  collection: {
    projected: 0,
    received: 0,
    due: 0,
  },
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getPendingPayments.fulfilled,
        (state, action: PayloadAction<PendingPaymentAttributes[]>) => {
          state.pendingPayments = action.payload;
        }
      )
      .addCase(
        getPreviousPayments.fulfilled,
        (
          state,
          action: PayloadAction<{
            payments: PreviousPaymentAttributes[];
            offset: number;
            total: number;
          }>
        ) => {
          state.previousPaymentsTotal = action.payload.total;
          if (!action.payload.offset) {
            state.previousPayments = action.payload.payments;
          } else {
            state.previousPayments = [
              ...state.previousPayments,
              ...action.payload.payments,
            ];
          }
        }
      )
      .addCase(
        createPayments.fulfilled,
        (state, action: PayloadAction<PreviousPaymentAttributes[]>) => {
          state.previousPayments = [
            ...action.payload,
            ...state.previousPayments,
          ];
        }
      )
      .addCase(
        updatePayment.fulfilled,
        (state, action: PayloadAction<UpdatePayment>) => {
          state.previousPayments = state.previousPayments.map((payment) => {
            if (payment.id === action.payload.id)
              return {
                ...payment,
                amount: Number(action.payload.data.values.amount),
              };
            return payment;
          });
        }
      )
      .addCase(
        deletePayment.fulfilled,
        (state, action: PayloadAction<number | string>) => {
          state.previousPayments = state.previousPayments.filter(
            (payment) => payment.id === action.payload
          );
          state.previousPaymentsTotal--;
        }
      )
      .addCase(
        getPaymentPlans.fulfilled,
        (state, action: PayloadAction<PaymentPlans>) => {
          state.paymentPlans = action.payload;
        }
      )
      .addCase(
        getCollectionDetails.fulfilled,
        (state, action: PayloadAction<CollectionAttributes>) => {
          state.collection = action.payload;
        }
      )
      .addCase(
        createPlan.fulfilled,
        (state, action: PayloadAction<PaymentPlanAttributes>) => {
          state.paymentPlans.future = action.payload;
        }
      )
      .addCase(
        updatePlan.fulfilled,
        (
          state,
          action: PayloadAction<{
            type: 'ongoing' | 'future';
            data: PaymentPlanAttributes;
          }>
        ) => {
          state.paymentPlans[action.payload.type] = action.payload.data;
        }
      )
      .addCase(deletePlan.fulfilled, (state, _) => {
        state.paymentPlans.future = null;
      });
  },
});

export default paymentSlice.reducer;
