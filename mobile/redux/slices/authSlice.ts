import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAdmin: <boolean>false,
  },
  reducers: {
    switchState: (state) => {
      state.isAdmin = !state.isAdmin;
    },
  },
});

export const { switchState } = authSlice.actions;

export default authSlice.reducer;
