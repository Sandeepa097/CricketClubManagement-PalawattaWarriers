import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTypes } from '../../constants/UserTypes';
import * as SecureStore from 'expo-secure-store';

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

export const login = createAsyncThunk(
  'auth/login',
  async (payload: GuestLogin | AdminLogin, { dispatch }) => {
    const data = JSON.stringify({ userType: payload.type, token: '' });
    await SecureStore.setItemAsync('auth', data);
    dispatch(authSlice.actions.setUser({ userType: payload.type, token: '' }));
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (params, { dispatch }) => {
    await SecureStore.deleteItemAsync('auth');
    dispatch(authSlice.actions.setUser({ userType: null, token: '' }));
  }
);

export const restoreAuth = createAsyncThunk(
  'auth/restoreAuth',
  async (params, { dispatch }) => {
    const value = await SecureStore.getItemAsync('auth');
    if (value) {
      const data = JSON.parse(value);
      return { userType: data.userType, token: data.token };
    }

    return { userType: null, token: '' };
  }
);

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
