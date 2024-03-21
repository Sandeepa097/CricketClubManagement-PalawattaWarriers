import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

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

export const createPlayer = createAsyncThunk(
  'player/create',
  async (payload: NewPlayerType, { dispatch, getState }) => {
    const id = (getState() as RootState).player.players.length + 1;
    return { ...payload, id };
  }
);

export const updatePlayer = createAsyncThunk(
  'player/update',
  async (payload: PlayerType) => {
    return payload;
  }
);

export const deletePlayer = createAsyncThunk(
  'player/delete',
  async (payload: number | string) => {
    return payload;
  }
);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
