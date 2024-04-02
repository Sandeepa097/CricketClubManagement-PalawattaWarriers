import { Request, Response } from 'express';
import {
  createMatch,
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
    oppositeTeamId,
    date,
    location,
    result,
  });

  await setMatchPlayers(createdMatch.dataValues.id, officialPlayers);
  await setMatchPlayersBattingStats(
    createdMatch.dataValues.id,
    (battingStats as BattingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateBattingPoints({ ...stat.values }),
    }))
  );
  await setMatchPlayersBowlingStats(
    createdMatch.dataValues.id,
    (bowlingStats as BowlingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateBowlingPoints({
        ...stat.values,
        numberOfDeliveriesPerOver,
      }),
    }))
  );
  await setMatchPlayersFieldingStats(
    createdMatch.dataValues.id,
    (fieldingStats as FieldingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateFieldingPoints({ ...stat.values }),
    }))
  );

  return res.status(StatusCodes.CREATED).json({
    message: 'Match created successfully.',
    match: createdMatch,
  });
};

const update = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const {
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

  const updatedMatch = await updateMatch(matchId, {
    oppositeTeamId,
    date,
    location,
    result,
  });

  await setMatchPlayers(matchId, officialPlayers);

  await setMatchPlayersBattingStats(
    matchId,
    (battingStats as BattingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateBattingPoints({ ...stat.values }),
    }))
  );

  await setMatchPlayersBowlingStats(
    matchId,
    (bowlingStats as BowlingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateBowlingPoints({
        ...stat.values,
        numberOfDeliveriesPerOver,
      }),
    }))
  );

  await setMatchPlayersFieldingStats(
    matchId,
    (fieldingStats as FieldingStatsInterface[]).map((stat) => ({
      id: stat.id,
      points: calculateFieldingPoints({ ...stat.values }),
    }))
  );

  return res.status(StatusCodes.CREATED).json({
    message: 'Match updated successfully.',
    match: updatedMatch,
  });
};

const get = async (req: Request, res: Response) => {
  const matchType = req.query.type as 'outdoor' | 'ppl' | null | undefined;
  const matches =
    matchType === 'outdoor' ? await getOutdoorMatches() : await getPPLMatches();

  return res.status(StatusCodes.OK).json({ matches });
};

const remove = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  await removeMatch(matchId);

  return res
    .status(StatusCodes.NO_CONTENT)
    .json({ message: 'Match removed successfully.' });
};

export default { create, update, remove, get };
