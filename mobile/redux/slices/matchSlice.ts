import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CompactSingleMatch, OutdoorMatch, PPLMatch } from '../../types';
import api from '../../api';

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
  oppositeTeamId: number | string;
}

const initialState: MatchState = {
  outdoors: [],
  ppls: [],
};

export const retrieveOutdoorMatches = createAsyncThunk(
  'match/retrieveOutdoor',
  async () => {
    const response: any = await api.get('/matches?type=outdoor');
    if (response.ok) {
      const outdoorCompactMatches: OutdoorMatch[] = [];
      const teamFlags = {};

      for (let i = 0; i < response.data.matches.length; i++) {
        if (teamFlags[response.data.matches[i].oppositeTeamId]) continue;
        teamFlags[response.data.matches[i].oppositeTeamId] = true;

        const oppositeTeamMatches = response.data.matches.filter(
          (match: NewMatch) =>
            match.oppositeTeamId === response.data.matches[i].oppositeTeamId
        );

        const counts = {
          all: oppositeTeamMatches.length,
          won: oppositeTeamMatches.filter(
            (match: NewMatch) => match.result === 'won'
          ).length,
          lost: oppositeTeamMatches.filter(
            (match: NewMatch) => match.result === 'lost'
          ).length,
          draw: oppositeTeamMatches.filter(
            (match: NewMatch) => match.result === 'draw'
          ).length,
        };

        const battingStats = {};
        const bowlingStats = {};

        oppositeTeamMatches.map((match: any) =>
          match.battingStats.map((stat: any) => {
            battingStats[stat.playerId] = {
              id: stat.playerId,
              name: stat.player.name,
              avatar: stat.player.avatar,
              score: (battingStats[stat.playerId]?.score || 0) + stat.score,
              balls: (battingStats[stat.playerId]?.balls || 0) + stat.balls,
              points: (battingStats[stat.playerId]?.points || 0) + stat.points,
            };
          })
        );

        oppositeTeamMatches.map((match: any) =>
          match.bowlingStats.map((stat: any) => {
            bowlingStats[stat.playerId] = {
              id: stat.playerId,
              name: stat.player.name,
              avatar: stat.player.avatar,
              wickets:
                (bowlingStats[stat.playerId]?.wickets || 0) + stat.wickets,
              conceded:
                (bowlingStats[stat.playerId]?.conceded || 0) + stat.conceded,
              points: (bowlingStats[stat.playerId]?.points || 0) + stat.points,
            };
          })
        );

        const bestBatsman: any =
          Object.values(battingStats) && Object.values(battingStats).length
            ? Object.values(battingStats).reduce(
                (prevPlayer: any, currentPlayer: any) =>
                  prevPlayer.points < currentPlayer.points
                    ? currentPlayer
                    : prevPlayer
              )
            : null;

        const bestBowler: any =
          Object.values(bowlingStats) && Object.values(bowlingStats).length
            ? Object.values(bowlingStats).reduce(
                (prevPlayer: any, currentPlayer: any) =>
                  prevPlayer.points < currentPlayer.points
                    ? currentPlayer
                    : prevPlayer
              )
            : null;

        outdoorCompactMatches.push({
          id: response.data.matches[i].oppositeTeamId,
          oppositeTeam: {
            id: response.data.matches[i].oppositeTeam.id,
            name: response.data.matches[i].oppositeTeam.name,
          },
          counts,
          matches: oppositeTeamMatches,
          winningPercentage: Math.round((counts.won * 100) / counts.all),
          title: response.data.matches[i].oppositeTeam.name,
          bestBatsman: bestBatsman
            ? {
                ...bestBatsman,
                score: `${bestBatsman.score}/${bestBatsman.balls}`,
              }
            : null,
          bestBowler: bestBowler
            ? {
                ...bestBowler,
                score: `${bestBowler.wickets}/${bestBowler.conceded}`,
              }
            : null,
        });
      }

      return outdoorCompactMatches;
    }

    return [];
  }
);

export const retrievePPLMatches = createAsyncThunk(
  'match/retrievePPL',
  async () => {
    const response: any = await api.get('/matches?type=ppl');
    if (response.ok) {
      const PPLCompactMatches: PPLMatch[] = [];
      const dateFlags = {};

      for (let i = 0; i < response.data.matches.length; i++) {
        if (dateFlags[response.data.matches[i].date]) continue;
        dateFlags[response.data.matches[i].date] = true;

        const PPLMatches = response.data.matches.filter(
          (match: NewMatch) => match.date === response.data.matches[i].date
        );

        const battingStats = {};
        const bowlingStats = {};

        PPLMatches.map((match: any) =>
          match.battingStats.map((stat: any) => {
            battingStats[stat.playerId] = {
              id: stat.playerId,
              name: stat.player.name,
              avatar: stat.player.avatar,
              score: (battingStats[stat.playerId]?.score || 0) + stat.score,
              balls: (battingStats[stat.playerId]?.balls || 0) + stat.balls,
              points: (battingStats[stat.playerId]?.points || 0) + stat.points,
            };
          })
        );

        PPLMatches.map((match: any) =>
          match.bowlingStats.map((stat: any) => {
            bowlingStats[stat.playerId] = {
              id: stat.playerId,
              name: stat.player.name,
              avatar: stat.player.avatar,
              wickets:
                (bowlingStats[stat.playerId]?.wickets || 0) + stat.wickets,
              conceded:
                (bowlingStats[stat.playerId]?.conceded || 0) + stat.conceded,
              points: (bowlingStats[stat.playerId]?.points || 0) + stat.points,
            };
          })
        );

        const bestBatsman: any =
          Object.values(battingStats) && Object.values(battingStats).length
            ? Object.values(battingStats).reduce(
                (prevPlayer: any, currentPlayer: any) =>
                  prevPlayer.points < currentPlayer.points
                    ? currentPlayer
                    : prevPlayer
              )
            : null;

        const bestBowler: any =
          Object.values(bowlingStats) && Object.values(bowlingStats).length
            ? Object.values(bowlingStats).reduce(
                (prevPlayer: any, currentPlayer: any) =>
                  prevPlayer.points < currentPlayer.points
                    ? currentPlayer
                    : prevPlayer
              )
            : null;

        PPLCompactMatches.push({
          id: response.data.matches[i].oppositeTeamId,
          matches: PPLMatches,
          title: response.data.matches[i].date,
          bestBatsman: bestBatsman
            ? {
                ...bestBatsman,
                score: `${bestBatsman.score}/${bestBatsman.balls}`,
              }
            : null,
          bestBowler: bestBowler
            ? {
                ...bestBowler,
                score: `${bestBowler.wickets}/${bestBowler.conceded}`,
              }
            : null,
        });
      }

      return PPLCompactMatches;
    }

    return [];
  }
);

export const createMatch = createAsyncThunk(
  'match/create',
  async (payload: NewMatch, { dispatch, rejectWithValue }) => {
    const response: any = await api.post('/matches', payload);
    if (response.ok) {
      dispatch(retrieveOutdoorMatches());
      dispatch(retrievePPLMatches());
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
      dispatch(retrieveOutdoorMatches());
      dispatch(retrievePPLMatches());
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
        (state, action: PayloadAction<OutdoorMatch[]>) => {
          state.outdoors = action.payload;
        }
      )
      .addCase(
        retrievePPLMatches.fulfilled,
        (state, action: PayloadAction<PPLMatch[]>) => {
          state.ppls = action.payload;
        }
      )
      .addCase(
        deleteMatch.fulfilled,
        (state, action: PayloadAction<DeleteMatch>) => {
          if (action.payload.oppositeTeamId) {
            state.outdoors = state.outdoors.map((outdoor) => {
              const matches = outdoor.matches.filter(
                (match) => match.id !== action.payload.id
              );
              const counts = {
                all: matches.length,
                won: matches.filter(
                  (match: CompactSingleMatch) => match.result === 'won'
                ).length,
                lost: matches.filter(
                  (match: CompactSingleMatch) => match.result === 'lost'
                ).length,
                draw: matches.filter(
                  (match: CompactSingleMatch) => match.result === 'draw'
                ).length,
              };

              return {
                ...outdoor,
                matches,
                counts,
              };
            });
          } else {
            state.ppls = state.ppls.map((ppl) => ({
              ...ppl,
              matches: ppl.matches.filter(
                (match) => match.id !== action.payload.id
              ),
            }));
          }
        }
      );
  },
});

export default matchSlice.reducer;
