import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import api from '../../api';

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

export const retrieveTeams = createAsyncThunk('team/retrieve', async () => {
  const response: any = await api.get('/teams');
  if (response.ok) return response.data.oppositeTeams;
  return [];
});

export const createTeam = createAsyncThunk(
  'team/create',
  async (payload: { name: string }) => {
    const response: any = await api.post('/teams', payload);
    if (response.ok) return response.data.oppositeTeam;
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.teams = [...state.teams, action.payload];
      })
      .addCase(
        retrieveTeams.fulfilled,
        (state, action: PayloadAction<Team[]>) => {
          state.teams = action.payload;
        }
      );
  },
});

export default teamSlice.reducer;
