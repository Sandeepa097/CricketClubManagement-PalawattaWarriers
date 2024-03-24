import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Team {
  id: number | string;
  name: string;
}

interface TeamState {
  teams: Team[];
}

const initialState: TeamState = {
  teams: [],
};

export const createTeam = createAsyncThunk(
  'team/create',
  async (payload: { name: string }, { getState }) => {
    const id = (getState() as RootState).team.teams.length + 1;
    return { ...payload, id };
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      createTeam.fulfilled,
      (state, action: PayloadAction<Team>) => {
        state.teams = [...state.teams, action.payload];
      }
    );
  },
});

export default teamSlice.reducer;
