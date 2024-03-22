import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StatusType {
  isEditing: boolean;
  isLoading: boolean;
}

const initialState: StatusType = {
  isEditing: false,
  isLoading: false,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setEditing, setLoading } = statusSlice.actions;

export default statusSlice.reducer;
