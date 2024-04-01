import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

interface NewPlayerType {
  avatar: string;
  name: string;
  mainRoll: 'batsman' | 'bowler' | 'allRounder';
  isCaptain: boolean;
  isWicketKeeper: boolean;
  feesPayingSince: {
    month: number;
    year: number;
  };
}

interface PlayerType extends NewPlayerType {
  id: number | string;
}

interface PlayerState {
  players: PlayerType[];
}

const initialState: PlayerState = {
  players: [],
};

export const retrievePlayers = createAsyncThunk('player/retrieve', async () => {
  const response: any = await api.get('/players');
  if (response.ok) return response.data.players;
  return [];
});

export const createPlayer = createAsyncThunk(
  'player/create',
  async (payload: NewPlayerType, { rejectWithValue }) => {
    const response: any = await api.post('/players', payload);
    if (response.ok) {
      return { ...response.data.player };
    }
    return rejectWithValue('Something went wrong.');
  }
);

export const updatePlayer = createAsyncThunk(
  'player/update',
  async (payload: PlayerType, { rejectWithValue }) => {
    const response: any = await api.put(`/players/${payload.id}`, payload);
    if (response.ok) {
      return payload;
    }
    return rejectWithValue('Something went wrong.');
  }
);

export const deletePlayer = createAsyncThunk(
  'player/delete',
  async (payload: number | string, { rejectWithValue }) => {
    const response: any = await api.delete(`/players/${payload}`);
    if (response.ok) {
      return payload;
    }
    return rejectWithValue('Something went wrong.');
  }
);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        retrievePlayers.fulfilled,
        (state, action: PayloadAction<PlayerType[]>) => {
          state.players = action.payload;
        }
      )
      .addCase(
        createPlayer.fulfilled,
        (state, action: PayloadAction<PlayerType>) => {
          state.players = [...state.players, action.payload];
        }
      )
      .addCase(
        updatePlayer.fulfilled,
        (state, action: PayloadAction<PlayerType>) => {
          state.players = state.players.map((player) =>
            player.id === action.payload.id ? action.payload : player
          );
        }
      )
      .addCase(
        deletePlayer.fulfilled,
        (state, action: PayloadAction<number | string>) => {
          state.players = state.players.filter(
            (player) => player.id !== action.payload
          );
        }
      );
  },
});

export default playerSlice.reducer;
