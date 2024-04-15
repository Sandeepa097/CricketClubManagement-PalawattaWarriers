import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

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
  effectiveFrom: {
    year: number;
    month: number;
  };
  fee: number;
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
  async () => {
    const response: any = await api.get('/payments');
    if (response.ok) {
      return response.data?.payments || [];
    }

    return [];
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
  async (payload: { details: NewPayment[] }, { rejectWithValue }) => {
    const response = await api.post('/payments', payload);
    if (response.ok) {
      return;
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
      dispatch(getPreviousPayments());
      return;
    }

    return rejectWithValue('Payment deletion failed.');
  }
);

const initialState: PaymentSliceState = {
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
        (state, action: PayloadAction<PreviousPaymentAttributes[]>) => {
          state.previousPayments = action.payload;
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
      );
  },
});

export default paymentSlice.reducer;
