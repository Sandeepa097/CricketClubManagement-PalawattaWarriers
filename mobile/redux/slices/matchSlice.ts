import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OutdoorMatch, PPLMatch } from '../../types';
import api from '../../api';
import { RootState } from '../store';
import { PAGE_SIZE } from '../../config/config';

interface MatchState {
  outdoorsTotal: number;
  pplsTotal: number;
  outdoors: OutdoorMatch[];
  ppls: PPLMatch[];
  renderedMatches: {
    total: number;
    tabCounts: {
      all: number;
      won: number;
      lost: number;
      draw: number;
    } | null;
    matches: Match[];
  };
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

interface Match {
  id: number;
  title: string;
  oppositeTeamId: number | null;
  date: string;
  location: string;
  result: 'won' | 'lost' | 'draw' | null | undefined;
}

interface NewMatch {
  isPPL: boolean;
  oppositeTeamId: string | number | null | undefined;
  date: string;
  title: string;
  location: string;
  result: 'won' | 'lost' | 'draw' | null | undefined;
  numberOfDeliveriesPerOver: number;
  officialPlayers: number[] | string[];
  battingStats: BattingStat[];
  bowlingStats: BowlingStat[];
  fieldingStats: FieldingStat[];
}

interface UpdateMatch extends NewMatch {
  id: number | string;
}

interface DeleteMatch {
  id: number | string;
  result?: 'won' | 'lost' | 'draw';
}

interface GetOutdoor {
  oppositeTeamId: number;
  result: string;
  offset: number;
}

interface GetPPL {
  date: string;
  offset: number;
}

const initialState: MatchState = {
  outdoorsTotal: 0,
  pplsTotal: 0,
  outdoors: [],
  ppls: [],
  renderedMatches: {
    total: 0,
    tabCounts: null,
    matches: [],
  },
};

export const retrieveOutdoorMatches = createAsyncThunk(
  'match/retrieveOutdoor',
  async (offset: number, { getState, rejectWithValue }) => {
    if (
      offset &&
      !(
        (getState() as RootState).match.ppls.length <
        (getState() as RootState).match.pplsTotal
      )
    )
      return rejectWithValue('End of the list reached.');

    const response: any = await api.get(
      `/matches?type=outdoor&limit=${PAGE_SIZE}&offset=${offset}`
    );
    if (response.ok) {
      const oppositeTeams = (getState() as RootState).team.teams;
      const players = (getState() as RootState).player.players;
      const outdoorCompactMatches: OutdoorMatch[] = [];
      for (let i = 0; i < response.data.matches.length; i++) {
        const oppositeTeam = oppositeTeams.find(
          (team) => team.id === response.data.matches[i].oppositeTeamId
        );

        const bestBatsman: any = players.find(
          (player) =>
            player.id === response.data.matches[i].bestBatter?.playerId
        );
        const bestBowler: any = players.find(
          (player) =>
            player.id === response.data.matches[i].bestBowler?.playerId
        );

        outdoorCompactMatches.push({
          id: response.data.matches[i].oppositeTeamId,
          oppositeTeam: {
            id: oppositeTeam?.id,
            name: oppositeTeam?.name,
          },
          winningPercentage: null,
          title: oppositeTeam?.name,
          bestBatsman: bestBatsman
            ? {
                ...bestBatsman,
                score: `${response.data.matches[i].bestBatter?.totalScore}/${response.data.matches[i].bestBatter?.totalBalls}`,
              }
            : null,
          bestBowler: bestBowler
            ? {
                ...bestBowler,
                score: `${response.data.matches[i].bestBowler?.totalWickets}/${response.data.matches[i].bestBowler?.totalConceded}`,
              }
            : null,
        });
      }

      return {
        matches: outdoorCompactMatches,
        offset,
        total: response.data.totalCount,
      };
    }

    rejectWithValue('Request failed');
  }
);

export const retrievePPLMatches = createAsyncThunk(
  'match/retrievePPL',
  async (offset: number, { getState, rejectWithValue }) => {
    if (
      offset &&
      !(
        (getState() as RootState).match.ppls.length <
        (getState() as RootState).match.pplsTotal
      )
    )
      return rejectWithValue('End of the list reached.');

    const response: any = await api.get(
      `/matches?type=ppl&limit=${PAGE_SIZE}&offset=${offset}`
    );
    if (response.ok) {
      const pplCompactMatches: PPLMatch[] = [];

      for (let i = 0; i < response.data.matches.length; i++) {
        const players = (getState() as RootState).player.players;
        const bestBatsman: any = players.find(
          (player) =>
            player.id === response.data.matches[i].bestBatter?.playerId
        );
        const bestBowler: any = players.find(
          (player) =>
            player.id === response.data.matches[i].bestBowler?.playerId
        );

        pplCompactMatches.push({
          id: response.data.matches[i].date,
          title: response.data.matches[i].date,
          bestBatsman: bestBatsman
            ? {
                ...bestBatsman,
                score: `${response.data.matches[i].bestBatter?.totalScore}/${response.data.matches[i].bestBatter?.totalBalls}`,
              }
            : null,
          bestBowler: bestBowler
            ? {
                ...bestBowler,
                score: `${response.data.matches[i].bestBowler?.totalWickets}/${response.data.matches[i].bestBowler?.totalConceded}`,
              }
            : null,
        });
      }

      return {
        matches: pplCompactMatches,
        offset,
        total: response.data.totalCount,
      };
    }

    rejectWithValue('Request failed');
  }
);

export const getMatches = createAsyncThunk(
  'match/getMatches',
  async (data: GetOutdoor | GetPPL, { getState, rejectWithValue }) => {
    if (
      data.offset &&
      !(
        (getState() as RootState).match.renderedMatches.matches.length <
        (getState() as RootState).match.renderedMatches.total
      )
    )
      return rejectWithValue('End of the list reached.');

    const response: any = await api.get(
      `/matches?${
        (data as GetOutdoor).oppositeTeamId
          ? `opposite=${(data as GetOutdoor).oppositeTeamId}&result=${
              (data as GetOutdoor).result
            }`
          : `date=${(data as GetPPL).date}`
      }&limit=${PAGE_SIZE}&offset=${data.offset}`
    );

    if (response.ok) {
      return {
        tabCounts: (data as GetOutdoor).result
          ? (getState() as RootState).match.renderedMatches.tabCounts
          : response.data.tabCounts,
        matches: response.data.matches,
        total: response.data.totalCount,
        offset: data.offset,
      };
    }

    rejectWithValue('Request failed');
  }
);

export const getPPLMatch = createAsyncThunk(
  'match/getOutdoor',
  async (
    data: { date: string; offset: number },
    { getState, rejectWithValue }
  ) => {
    if (
      data.offset &&
      !(
        (getState() as RootState).match.renderedMatches.matches.length <
        (getState() as RootState).match.renderedMatches.total
      )
    )
      return rejectWithValue('End of the list reached.');

    const response: any = await api.get(`/matches?date=${data.date}`);

    if (response.ok) {
      return {
        matches: response.data.matches,
        total: response.data.totalCount,
        offset: data.offset,
      };
    }

    rejectWithValue('Request failed');
  }
);

export const createMatch = createAsyncThunk(
  'match/create',
  async (payload: NewMatch, { dispatch, rejectWithValue }) => {
    const response: any = await api.post('/matches', payload);
    if (response.ok) {
      dispatch(retrieveOutdoorMatches(0));
      dispatch(retrievePPLMatches(0));
      return;
    }
    return rejectWithValue(response.data?.message);
  }
);

export const updateMatch = createAsyncThunk(
  'match/update',
  async (payload: UpdateMatch, { dispatch, rejectWithValue }) => {
    const response: any = await api.put(`/matches/${payload.id}`, payload);
    if (response.ok) {
      dispatch(retrieveOutdoorMatches(0));
      dispatch(retrievePPLMatches(0));
      return;
    }
    return rejectWithValue(response.data?.message);
  }
);

export const deleteMatch = createAsyncThunk(
  'match/delete',
  async (payload: DeleteMatch, { rejectWithValue }) => {
    const response: any = await api.delete(`/matches/${payload.id}`);
    if (response.ok) {
      return payload;
    }
    return rejectWithValue(response.data?.message);
  }
);

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        retrieveOutdoorMatches.fulfilled,
        (
          state,
          action: PayloadAction<{
            matches: OutdoorMatch[];
            offset: number;
            total: number;
          }>
        ) => {
          state.outdoorsTotal = action.payload.total;
          if (!action.payload.offset) {
            state.outdoors = action.payload.matches;
          } else {
            state.outdoors = [...state.outdoors, ...action.payload.matches];
          }
        }
      )
      .addCase(
        retrievePPLMatches.fulfilled,
        (
          state,
          action: PayloadAction<{
            matches: PPLMatch[];
            offset: number;
            total: number;
          }>
        ) => {
          state.pplsTotal = action.payload.total;
          if (!action.payload.offset) {
            state.ppls = action.payload.matches;
          } else {
            state.ppls = [...state.ppls, ...action.payload.matches];
          }
        }
      )
      .addCase(
        getMatches.fulfilled,
        (
          state,
          action: PayloadAction<{
            tabCounts: {
              all: number;
              won: number;
              lost: number;
              draw: number;
            } | null;
            matches: Match[];
            offset: number;
            total: number;
          }>
        ) => {
          state.renderedMatches.total = action.payload.total;
          state.renderedMatches.tabCounts = action.payload.tabCounts;
          if (!action.payload.offset) {
            state.renderedMatches.matches = action.payload.matches;
          } else {
            state.renderedMatches.matches = [
              ...state.renderedMatches.matches,
              ...action.payload.matches,
            ];
          }
        }
      )
      .addCase(
        deleteMatch.fulfilled,
        (state, action: PayloadAction<DeleteMatch>) => {
          state.renderedMatches.total--;
          state.renderedMatches.matches = state.renderedMatches.matches.filter(
            (match) => match.id !== action.payload.id
          );
          state.renderedMatches.tabCounts = action.payload.result
            ? {
                ...state.renderedMatches.tabCounts,
                [action.payload.result]:
                  state.renderedMatches.tabCounts[action.payload.result] - 1,
              }
            : null;
        }
      );
  },
});

export default matchSlice.reducer;
