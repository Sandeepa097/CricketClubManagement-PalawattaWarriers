import { Request, Response } from 'express';
import {
  createMatch,
  findMatch,
  getGroupMatchesCount,
  getMatches,
  getMatchesCount,
  getOutdoorMatches,
  getPPLMatches,
  removeMatch,
  setMatchPlayers,
  setMatchPlayersBattingStats,
  setMatchPlayersBowlingStats,
  setMatchPlayersFieldingStats,
  updateMatch,
} from '../services/matchService';
import { StatusCodes } from 'http-status-codes';
import {
  calculateBattingPoints,
  calculateBowlingPoints,
  calculateFieldingPoints,
} from '../services/pointService';

interface BattingStatsInterface {
  id: number;
  values: {
    score?: number;
    balls: number;
    sixes?: number;
    fours?: number;
    isOut?: boolean;
  };
}

interface BowlingStatsInterface {
  id: number;
  values: {
    wickets?: number;
    overs: number;
    conceded?: number;
    maidens?: number;
  };
}

interface FieldingStatsInterface {
  id: number;
  values: {
    catches?: number;
    stumps?: number;
    directHits?: number;
    indirectHits?: number;
  };
}

const create = async (req: Request, res: Response) => {
  const {
    title,
    oppositeTeamId,
    date,
    location,
    result,
    officialPlayers,
    battingStats,
    bowlingStats,
    fieldingStats,
    numberOfDeliveriesPerOver,
  } = req.body;

  const createdMatch = await createMatch({
    title,
    oppositeTeamId,
    date,
    location,
    result,
  });

  await setMatchPlayers(createdMatch, officialPlayers);
  await setMatchPlayersBattingStats(
    createdMatch,
    (battingStats as BattingStatsInterface[]).map((stat) => {
      const battingPoints = calculateBattingPoints({ ...stat.values });
      return {
        id: stat.id,
        ...stat.values,
        strikeRate: battingPoints.strikeRate,
        points: battingPoints.totalPoints,
      };
    })
  );
  await setMatchPlayersBowlingStats(
    createdMatch,
    (bowlingStats as BowlingStatsInterface[]).map((stat) => {
      const bowlingPoints = calculateBowlingPoints({
        ...stat.values,
        numberOfDeliveriesPerOver,
      });
      return {
        id: stat.id,
        ...stat.values,
        economy: bowlingPoints.economy,
        points: bowlingPoints.totalPoints,
      };
    })
  );

  await setMatchPlayersFieldingStats(
    createdMatch,
    officialPlayers.map((playerId: number) => {
      const fieldingStat = (fieldingStats as FieldingStatsInterface[]).find(
        (stat) => stat.id === playerId
      ) ?? { id: playerId, values: {} };
      return {
        id: fieldingStat.id,
        ...fieldingStat.values,
        points: calculateFieldingPoints({ ...fieldingStat.values }),
      };
    })
  );

  return res.status(StatusCodes.CREATED).json({
    message: 'Match created successfully.',
    match: createdMatch,
  });
};

const update = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const {
    title,
    oppositeTeamId,
    date,
    location,
    result,
    officialPlayers,
    battingStats,
    bowlingStats,
    fieldingStats,
    numberOfDeliveriesPerOver,
  } = req.body;

  await updateMatch(matchId, {
    title,
    oppositeTeamId,
    date,
    location,
    result,
  });

  const updatedMatch = await findMatch(matchId);

  if (!updatedMatch)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Match not found.' });

  await setMatchPlayers(updatedMatch, officialPlayers);

  await setMatchPlayersBattingStats(
    updatedMatch,
    (battingStats as BattingStatsInterface[]).map((stat) => {
      const battingPoints = calculateBattingPoints({ ...stat.values });
      return {
        id: stat.id,
        ...stat.values,
        strikeRate: battingPoints.strikeRate,
        points: battingPoints.totalPoints,
      };
    })
  );

  await setMatchPlayersBowlingStats(
    updatedMatch,
    (bowlingStats as BowlingStatsInterface[]).map((stat) => {
      const bowlingPoints = calculateBowlingPoints({
        ...stat.values,
        numberOfDeliveriesPerOver,
      });
      return {
        id: stat.id,
        ...stat.values,
        economy: bowlingPoints.economy,
        points: bowlingPoints.totalPoints,
      };
    })
  );

  await setMatchPlayersFieldingStats(
    updatedMatch,
    officialPlayers.map((playerId: number) => {
      const fieldingStat = (fieldingStats as FieldingStatsInterface[]).find(
        (stat) => stat.id === playerId
      ) ?? { id: playerId, values: {} };
      return {
        id: fieldingStat.id,
        ...fieldingStat.values,
        points: calculateFieldingPoints({ ...fieldingStat.values }),
      };
    })
  );

  return res.status(StatusCodes.CREATED).json({
    message: 'Match updated successfully.',
  });
};

const index = async (req: Request, res: Response) => {
  const limit: any = req.query.limit;
  const offset: number = Number(req.query.offset || 0);
  const matchType = req.query.type as 'outdoor' | 'ppl' | null | undefined;
  const matchDate = req.query.date as string | null | undefined;
  const matchOppositeTeamId = req.query.opposite as
    | string
    | number
    | null
    | undefined;
  const matchResult = req.query.result as
    | 'won'
    | 'lost'
    | 'draw'
    | null
    | undefined;

  let totalCount = 0;
  let matches = [];
  let tabCounts = null;

  if (matchType) {
    totalCount = await getGroupMatchesCount(matchType || 'ppl');
    matches =
      matchType === 'outdoor'
        ? await getOutdoorMatches(offset, Number(limit || totalCount))
        : await getPPLMatches(offset, Number(limit || totalCount));
  } else {
    const where = matchDate
      ? { date: matchDate }
      : {
          oppositeTeamId: matchOppositeTeamId || null,
          ...(matchResult ? { result: matchResult } : {}),
        };
    totalCount = await getMatchesCount(where);
    matches = await getMatches(where, offset, Number(limit || totalCount));
    if (matchOppositeTeamId && !matchResult) {
      tabCounts = {
        all: await getMatchesCount({ oppositeTeamId: matchOppositeTeamId }),
        won: await getMatchesCount({
          oppositeTeamId: matchOppositeTeamId,
          result: 'won',
        }),
        lost: await getMatchesCount({
          oppositeTeamId: matchOppositeTeamId,
          result: 'lost',
        }),
        draw: await getMatchesCount({
          oppositeTeamId: matchOppositeTeamId,
          result: 'draw',
        }),
      };
    }
  }

  return res.status(StatusCodes.OK).json({ matches, totalCount, tabCounts });
};

const remove = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  await removeMatch(matchId);

  return res
    .status(StatusCodes.NO_CONTENT)
    .json({ message: 'Match removed successfully.' });
};

export default { create, update, remove, index };
