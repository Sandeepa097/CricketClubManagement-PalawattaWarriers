import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTypes } from '../../constants/UserTypes';
import * as SecureStore from 'expo-secure-store';
import { create } from 'apisauce';
import { API_URL } from '../../config/config';
import { StatusCodes } from 'http-status-codes';
import { setLoading } from './statusSlice';

interface AuthState {
  userType: UserTypes | null;
  token: string;
}

interface GuestLogin {
  type: UserTypes.GUEST;
}

interface AdminLogin {
  type: UserTypes.ADMIN;
  username: string;
  password: string;
}

const authApi = create({
  baseURL: API_URL + '/auth',
});

export const login = createAsyncThunk(
  'auth/login',
  async (payload: GuestLogin | AdminLogin, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    let data = {
      userType: payload.type,
      token: '',
      refreshToken: '',
    };
    if (payload.type !== UserTypes.GUEST) {
      const response: any = await authApi.post('/login', {
        username: payload.username,
        password: payload.password,
      });

      if (!response.ok) {
        dispatch(setLoading(false));
        return rejectWithValue(
          (response.status === StatusCodes.UNAUTHORIZED &&
            response.data?.message) ||
            'Something went wrong. Please try again later.'
        );
      } else {
        data = {
          ...data,
          userType: response.data.user.userType,
          token: response.data.user.accessToken,
          refreshToken: response.data.user.refreshToken,
        };
      }
    }

    await SecureStore.setItemAsync('auth', JSON.stringify(data));
    dispatch(
      authSlice.actions.setUser({ userType: data.userType, token: data.token })
    );
    dispatch(setLoading(false));
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await SecureStore.deleteItemAsync('auth');
    dispatch(authSlice.actions.setUser({ userType: null, token: '' }));
  }
);

export const restoreAuth = createAsyncThunk('auth/restoreAuth', async (_) => {
  const value = await SecureStore.getItemAsync('auth');
  if (value) {
    const data = JSON.parse(value);
    return { userType: data.userType, token: data.token };
  }

  return { userType: null, token: '' };
});

const initialState: AuthState = {
  userType: null,
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.userType = action.payload.userType;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      restoreAuth.fulfilled,
      (state, action: PayloadAction<AuthState>) => {
        state.token = action.payload.token;
        state.userType = action.payload.userType;
      }
    );
  },
});

export default authSlice.reducer;
