import { Request, Response } from 'express';
import {
  createPPLGroup,
  createMatch,
  findMatch,
  getGroupMatchesCount,
  getMatches,
  getMatchesCount,
  getOutdoorMatches,
  getPPLMatches,
  removePPLGroup,
  removeMatch,
  setMatchPlayers,
  setMatchPlayersBattingStats,
  setMatchPlayersBowlingStats,
  setMatchPlayersFieldingStats,
  updatePPLGroup,
  updateMatch,
} from '../services/matchService';
import { StatusCodes } from 'http-status-codes';
import {
  calculateBattingPoints,
  calculateBowlingPoints,
  calculateFieldingPoints,
} from '../services/pointService';
import { randomUUID } from 'crypto';

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
    isPPL,
    title,
    oppositeTeamId,
    pplGroupTitle,
    teamATitle,
    teamBTitle,
    date,
    location,
    result,
    officialPlayers,
    teamAPlayers,
    teamBPlayers,
    battingStats,
    bowlingStats,
    fieldingStats,
    numberOfDeliveriesPerOver,
  } = req.body;

  const normalizedMatchPlayers = officialPlayers || [];

  const getStatsByPlayerIds = <T extends { id: number }>(
    stats: T[] = [],
    playerIds: number[] = [],
  ) => stats.filter((stat) => playerIds.includes(stat.id));

  if (isPPL) {
    const pplGroupId = randomUUID();
    const firstTeamTitle = teamATitle || 'Team A';
    const secondTeamTitle = teamBTitle || 'Team B';

    await createPPLGroup({
      id: pplGroupId,
      title: pplGroupTitle || null,
    });

    const createdMatchOne = await createMatch({
      title: firstTeamTitle,
      oppositeTeamId: null,
      pplGroupId,
      pplTeamSide: 'teamA',
      date,
      location,
      result: null,
    });

    const createdMatchTwo = await createMatch({
      title: secondTeamTitle,
      oppositeTeamId: null,
      pplGroupId,
      pplTeamSide: 'teamB',
      date,
      location,
      result: null,
    });

    const teamAPlayersNormalized = teamAPlayers || [];
    const teamBPlayersNormalized = teamBPlayers || [];

    await setMatchPlayers(createdMatchOne, teamAPlayersNormalized);
    await setMatchPlayers(createdMatchTwo, teamBPlayersNormalized);

    const teamABattingStats = getStatsByPlayerIds(
      battingStats,
      teamAPlayers || [],
    ) as BattingStatsInterface[];
    const teamBBattingStats = getStatsByPlayerIds(
      battingStats,
      teamBPlayers || [],
    ) as BattingStatsInterface[];

    const teamABowlingStats = getStatsByPlayerIds(
      bowlingStats,
      teamAPlayers || [],
    ) as BowlingStatsInterface[];
    const teamBBowlingStats = getStatsByPlayerIds(
      bowlingStats,
      teamBPlayers || [],
    ) as BowlingStatsInterface[];

    const teamAFieldingStats = getStatsByPlayerIds(
      fieldingStats,
      teamAPlayers || [],
    ) as FieldingStatsInterface[];
    const teamBFieldingStats = getStatsByPlayerIds(
      fieldingStats,
      teamBPlayers || [],
    ) as FieldingStatsInterface[];

    await setMatchPlayersBattingStats(
      createdMatchOne,
      teamABattingStats.map((stat) => {
        const battingPoints = calculateBattingPoints({ ...stat.values });
        return {
          id: stat.id,
          ...stat.values,
          strikeRate: battingPoints.strikeRate,
          points: battingPoints.totalPoints,
        };
      }),
    );
    await setMatchPlayersBattingStats(
      createdMatchTwo,
      teamBBattingStats.map((stat) => {
        const battingPoints = calculateBattingPoints({ ...stat.values });
        return {
          id: stat.id,
          ...stat.values,
          strikeRate: battingPoints.strikeRate,
          points: battingPoints.totalPoints,
        };
      }),
    );

    await setMatchPlayersBowlingStats(
      createdMatchOne,
      teamABowlingStats.map((stat) => {
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
      }),
    );
    await setMatchPlayersBowlingStats(
      createdMatchTwo,
      teamBBowlingStats.map((stat) => {
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
      }),
    );

    await setMatchPlayersFieldingStats(
      createdMatchOne,
      teamAPlayersNormalized.map((playerId: number) => {
        const fieldingStat = teamAFieldingStats.find(
          (stat) => stat.id === playerId,
        ) ?? { id: playerId, values: {} };
        return {
          id: fieldingStat.id,
          ...fieldingStat.values,
          points: calculateFieldingPoints({ ...fieldingStat.values }),
        };
      }),
    );

    await setMatchPlayersFieldingStats(
      createdMatchTwo,
      teamBPlayersNormalized.map((playerId: number) => {
        const fieldingStat = teamBFieldingStats.find(
          (stat) => stat.id === playerId,
        ) ?? { id: playerId, values: {} };
        return {
          id: fieldingStat.id,
          ...fieldingStat.values,
          points: calculateFieldingPoints({ ...fieldingStat.values }),
        };
      }),
    );

    return res.status(StatusCodes.CREATED).json({
      message: 'PPL match group created successfully.',
      pplGroupId,
      pplGroupTitle: pplGroupTitle || null,
      matches: [createdMatchOne, createdMatchTwo],
    });
  }

  const createdMatch = await createMatch({
    title,
    oppositeTeamId,
    pplGroupId: null,
    pplTeamSide: null,
    date,
    location,
    result,
  });

  await setMatchPlayers(createdMatch, normalizedMatchPlayers);
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
    }),
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
    }),
  );

  await setMatchPlayersFieldingStats(
    createdMatch,
    normalizedMatchPlayers.map((playerId: number) => {
      const fieldingStat = (fieldingStats as FieldingStatsInterface[]).find(
        (stat) => stat.id === playerId,
      ) ?? { id: playerId, values: {} };
      return {
        id: fieldingStat.id,
        ...fieldingStat.values,
        points: calculateFieldingPoints({ ...fieldingStat.values }),
      };
    }),
  );

  return res.status(StatusCodes.CREATED).json({
    message: 'Match created successfully.',
    match: createdMatch,
  });
};

const update = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const {
    isPPL,
    title,
    oppositeTeamId,
    pplGroupId,
    pplGroupTitle,
    pplTeamSide,
    teamATitle,
    teamBTitle,
    date,
    location,
    result,
    officialPlayers,
    teamAPlayers,
    teamBPlayers,
    battingStats,
    bowlingStats,
    fieldingStats,
    numberOfDeliveriesPerOver,
  } = req.body;

  const existingMatch = await findMatch(matchId);
  if (!existingMatch)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Match not found.' });

  let resolvedPplGroupId: string | null = null;
  let resolvedPplTeamSide: 'teamA' | 'teamB' | null = null;

  if (isPPL) {
    resolvedPplGroupId =
      pplGroupId || (existingMatch.dataValues.pplGroupId as string | null);

    if (!resolvedPplGroupId) {
      resolvedPplGroupId = randomUUID();
      await createPPLGroup({
        id: resolvedPplGroupId,
        title: pplGroupTitle || null,
      });
    } else if (pplGroupTitle !== undefined) {
      await updatePPLGroup(resolvedPplGroupId, {
        title: pplGroupTitle || null,
      });
    }

    resolvedPplTeamSide =
      pplTeamSide ||
      (existingMatch.dataValues.pplTeamSide as 'teamA' | 'teamB' | null) ||
      'teamA';
  }

  const getStatsByPlayerIds = <T extends { id: number }>(
    stats: T[] = [],
    playerIds: number[] = [],
  ) => stats.filter((stat) => playerIds.includes(stat.id));

  const convertingOutdoorToPPL =
    isPPL &&
    !!existingMatch.dataValues.oppositeTeamId &&
    !existingMatch.dataValues.pplGroupId;

  if (convertingOutdoorToPPL) {
    const teamAPlayersNormalized = teamAPlayers || [];
    const teamBPlayersNormalized = teamBPlayers || [];

    const teamABattingStats = getStatsByPlayerIds(
      battingStats,
      teamAPlayers || [],
    ) as BattingStatsInterface[];
    const teamBBattingStats = getStatsByPlayerIds(
      battingStats,
      teamBPlayers || [],
    ) as BattingStatsInterface[];

    const teamABowlingStats = getStatsByPlayerIds(
      bowlingStats,
      teamAPlayers || [],
    ) as BowlingStatsInterface[];
    const teamBBowlingStats = getStatsByPlayerIds(
      bowlingStats,
      teamBPlayers || [],
    ) as BowlingStatsInterface[];

    const teamAFieldingStats = getStatsByPlayerIds(
      fieldingStats,
      teamAPlayers || [],
    ) as FieldingStatsInterface[];
    const teamBFieldingStats = getStatsByPlayerIds(
      fieldingStats,
      teamBPlayers || [],
    ) as FieldingStatsInterface[];

    await updateMatch(matchId, {
      title: teamATitle || title || 'Team A',
      oppositeTeamId: null,
      pplGroupId: resolvedPplGroupId,
      pplTeamSide: 'teamA',
      date,
      location,
      result: null,
    });

    const updatedTeamAMatch = await findMatch(matchId);
    if (!updatedTeamAMatch)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Match not found.' });

    await setMatchPlayers(updatedTeamAMatch, teamAPlayersNormalized);

    await setMatchPlayersBattingStats(
      updatedTeamAMatch,
      teamABattingStats.map((stat) => {
        const battingPoints = calculateBattingPoints({ ...stat.values });
        return {
          id: stat.id,
          ...stat.values,
          strikeRate: battingPoints.strikeRate,
          points: battingPoints.totalPoints,
        };
      }),
    );

    await setMatchPlayersBowlingStats(
      updatedTeamAMatch,
      teamABowlingStats.map((stat) => {
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
      }),
    );

    await setMatchPlayersFieldingStats(
      updatedTeamAMatch,
      teamAPlayersNormalized.map((playerId: number) => {
        const fieldingStat = teamAFieldingStats.find(
          (stat) => stat.id === playerId,
        ) ?? { id: playerId, values: {} };
        return {
          id: fieldingStat.id,
          ...fieldingStat.values,
          points: calculateFieldingPoints({ ...fieldingStat.values }),
        };
      }),
    );

    const createdTeamBMatch = await createMatch({
      title: teamBTitle || 'Team B',
      oppositeTeamId: null,
      pplGroupId: resolvedPplGroupId,
      pplTeamSide: 'teamB',
      date,
      location,
      result: null,
    });

    await setMatchPlayers(createdTeamBMatch, teamBPlayersNormalized);

    await setMatchPlayersBattingStats(
      createdTeamBMatch,
      teamBBattingStats.map((stat) => {
        const battingPoints = calculateBattingPoints({ ...stat.values });
        return {
          id: stat.id,
          ...stat.values,
          strikeRate: battingPoints.strikeRate,
          points: battingPoints.totalPoints,
        };
      }),
    );

    await setMatchPlayersBowlingStats(
      createdTeamBMatch,
      teamBBowlingStats.map((stat) => {
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
      }),
    );

    await setMatchPlayersFieldingStats(
      createdTeamBMatch,
      teamBPlayersNormalized.map((playerId: number) => {
        const fieldingStat = teamBFieldingStats.find(
          (stat) => stat.id === playerId,
        ) ?? { id: playerId, values: {} };
        return {
          id: fieldingStat.id,
          ...fieldingStat.values,
          points: calculateFieldingPoints({ ...fieldingStat.values }),
        };
      }),
    );

    return res.status(StatusCodes.CREATED).json({
      message: 'Outdoor match converted to PPL successfully.',
      pplGroupId: resolvedPplGroupId,
      matches: [updatedTeamAMatch, createdTeamBMatch],
    });
  }

  const normalizedMatchPlayers =
    teamAPlayers?.length || teamBPlayers?.length
      ? [...(teamAPlayers || []), ...(teamBPlayers || [])]
      : officialPlayers || [];

  await updateMatch(matchId, {
    title,
    oppositeTeamId: isPPL ? null : oppositeTeamId,
    pplGroupId: isPPL ? resolvedPplGroupId : null,
    pplTeamSide: isPPL ? resolvedPplTeamSide : null,
    date,
    location,
    result: isPPL ? null : result,
  });

  await setMatchPlayers(existingMatch, normalizedMatchPlayers);

  await setMatchPlayersBattingStats(
    existingMatch,
    (battingStats as BattingStatsInterface[]).map((stat) => {
      const battingPoints = calculateBattingPoints({ ...stat.values });
      return {
        id: stat.id,
        ...stat.values,
        strikeRate: battingPoints.strikeRate,
        points: battingPoints.totalPoints,
      };
    }),
  );

  await setMatchPlayersBowlingStats(
    existingMatch,
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
    }),
  );

  await setMatchPlayersFieldingStats(
    existingMatch,
    normalizedMatchPlayers.map((playerId: number) => {
      const fieldingStat = (fieldingStats as FieldingStatsInterface[]).find(
        (stat) => stat.id === playerId,
      ) ?? { id: playerId, values: {} };
      return {
        id: fieldingStat.id,
        ...fieldingStat.values,
        points: calculateFieldingPoints({ ...fieldingStat.values }),
      };
    }),
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
  const pplGroupId = req.query.pplGroupId as string | null | undefined;
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
    const parsedSingleMatchId =
      pplGroupId && pplGroupId.startsWith('single-')
        ? Number(pplGroupId.replace('single-', ''))
        : null;
    const parsedNumericGroupFallbackId =
      pplGroupId && /^\d+$/.test(pplGroupId) ? Number(pplGroupId) : null;

    const where = pplGroupId
      ? parsedSingleMatchId || parsedNumericGroupFallbackId
        ? {
            id: parsedSingleMatchId || parsedNumericGroupFallbackId,
            oppositeTeamId: null,
          }
        : { pplGroupId, oppositeTeamId: null }
      : matchDate
        ? { date: matchDate, oppositeTeamId: null }
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
  const matchToRemove: any = await findMatch(matchId);
  const pplGroupId = matchToRemove?.dataValues?.pplGroupId || null;

  await removeMatch(matchId);

  if (pplGroupId) {
    const groupedMatchesCount = await getMatchesCount({ pplGroupId });
    if (!groupedMatchesCount) {
      await removePPLGroup(pplGroupId);
    }
  }

  return res
    .status(StatusCodes.NO_CONTENT)
    .json({ message: 'Match removed successfully.' });
};

export default { create, update, remove, index };
