import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OutdoorMatch, PPLMatch } from '../../types';
import { RootState } from '../store';

interface MatchState {
  outdoors: OutdoorMatch[];
  ppls: PPLMatch[];
}

interface BattingStat {
  id: string | number;
  values: {
    score: number | string | null | undefined;
    balls: number | string | null | undefined;
    fours: number | string | null | undefined;
    sixes: number | string | null | undefined;
    isOut: number | string | null | undefined;
  };
}

interface BowlingStat {
  id: string | number;
  values: {
    wickets: number | string | null | undefined;
    overs: number | string | null | undefined;
    conceded: number | string | null | undefined;
    maidens: number | string | null | undefined;
  };
}

interface FieldingStat {
  id: string | number;
  values: {
    catches: number | string | null | undefined;
    stumps: number | string | null | undefined;
    directHits: number | string | null | undefined;
    indirectHits: number | string | null | undefined;
  };
}

interface NewMatch {
  isPPL: boolean;
  oppositeTeamId: string | number | null | undefined;
  date: string;
  location: string;
  result: 'won' | 'lost' | 'draw' | null | undefined;
  numberOfDeliveriesPerOver: number;
  officialPlayers: number[] | string[];
  battingStats: BattingStat[];
  bowlingStats: BowlingStat[];
  fieldingStats: FieldingStat[];
}

const initialState: MatchState = {
  outdoors: [],
  ppls: [],
};

export const createMatch = createAsyncThunk(
  'match/create',
  async (payload: NewMatch, { getState }) => {
    console.log('bat ', payload.battingStats[0].values);
    console.log('bowl ', payload.bowlingStats[0].values);
    console.log('field ', payload.fieldingStats[0].values);
    const bestBatsman = payload.battingStats.length
      ? {
          id: payload.battingStats[0].id,
          name: (getState() as RootState).player.players.find(
            (player) => player.id === payload.battingStats[0].id
          ).name,
          avatar: (getState() as RootState).player.players.find(
            (player) => player.id === payload.battingStats[0].id
          ).avatar,
          score: `${payload.battingStats[0].values.score}/${payload.battingStats[0].values.balls}`,
        }
      : null;
    const bestBowler = payload.bowlingStats.length
      ? {
          id: payload.bowlingStats[0].id,
          name: (getState() as RootState).player.players.find(
            (player) => player.id === payload.bowlingStats[0].id
          ).name,
          avatar: (getState() as RootState).player.players.find(
            (player) => player.id === payload.battingStats[0].id
          ).avatar,
          score: `${payload.bowlingStats[0].values.wickets}/${
            Math.floor(Number(payload.bowlingStats[0].values.overs)) * 6 +
            ((Math.floor(Number(payload.bowlingStats[0].values.overs)) * 10) %
              10)
          }`,
        }
      : null;

    if (payload.isPPL) {
      const id = (getState() as RootState).match.ppls.length + 1;
      return { ...payload, id, bestBatsman, bestBowler, title: payload.date };
    } else {
      const compactMatch = (getState() as RootState).match.outdoors.find(
        (outdoor) => outdoor.oppositeTeam.id === payload.oppositeTeamId
      );
      const id = compactMatch ? compactMatch.matches.length + 1 : 1;
      return compactMatch
        ? {
            id,
            date: payload.date,
            location: payload.location,
            result: payload.result,
            compactMatchId: compactMatch.id,
          }
        : {
            id: (getState() as RootState).match.outdoors.length + 1,
            title: (getState() as RootState).team.teams.find(
              (team) => team.id === payload.oppositeTeamId
            ).name,
            bestBatsman,
            bestBowler,
            counts: {
              all: 0,
              won: 0,
              lost: 0,
              draw: 0,
            },
            matches: [
              {
                id,
                date: payload.date,
                location: payload.location,
                result: payload.result,
              },
            ],
            winningPercentage: 10,
          };
    }
  }
);

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      createMatch.fulfilled,
      (
        state,
        action: PayloadAction<OutdoorMatch | PPLMatch | NewMatch | any>
      ) => {
        if (action.payload.compactMatchId) {
          state.outdoors = state.outdoors.map((outdoor) => {
            if (outdoor.id === action.payload.compactMatchId) {
              return {
                ...outdoor,
                matches: [
                  ...outdoor.matches,
                  {
                    id: action.payload.id,
                    date: action.payload.date,
                    location: action.payload.location,
                    result: action.payload.result,
                  },
                ],
              };
            } else {
              return outdoor;
            }
          });
        } else if ((action.payload as NewMatch).isPPL) {
          state.ppls = [
            ...state.ppls,
            {
              id: action.payload.id,
              title: action.payload.title as string,
              date: action.payload.date,
              bestBatsman: action.payload.bestBatsman,
              bestBowler: action.payload.bestBowler,
            },
          ];
        } else {
          state.outdoors = [...state.outdoors, action.payload];
        }
      }
    );
  },
});

export default matchSlice.reducer;
