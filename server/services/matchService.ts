import { Op } from 'sequelize';
import {
  Match,
  MatchPlayer,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
  MatchPlayerFieldingStat,
  OppositeTeam,
  Player,
} from '../models';
import { findPlayers } from './playerService';
import sequelizeConnection from '../config/sequelizeConnection';

interface CreateMatchAttributes {
  title: string;
  oppositeTeamId: number | null;
  date: string;
  location: string;
  result: string | null;
}

export const createMatch = async (match: CreateMatchAttributes) => {
  return await Match.create({ ...match });
};

export const updateMatch = async (id: number, match: CreateMatchAttributes) => {
  return await Match.update(match, { where: { id } });
};

export const findMatch = async (id: number) => {
  return await Match.findOne({
    where: { id },
  });
};

export const removeMatch = async (id: number) => {
  return await Match.destroy({ where: { id } });
};

export const getPPLMatches = async (offset: number = 0, limit: number = 10) => {
  const ppls: any = await Match.findAll({
    where: { oppositeTeamId: { [Op.is]: null } },
    attributes: [
      'date',
      [
        sequelizeConnection.fn('max', sequelizeConnection.col('id')),
        'latestMatchId',
      ],
    ],
    group: ['date'],
    order: [['latestMatchId', 'DESC']],
    limit: limit,
    offset: offset,
    raw: true,
  });

  const dates = ppls.map((ppl: any) => ppl.date);

  const matchIds = await Match.findAll({
    where: { date: { [Op.in]: dates } },
    attributes: ['id', 'date'],
    raw: true,
  });

  const matchIdsByDate = matchIds.reduce((acc: any, match: any) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match.id);
    return acc;
  }, {});

  const allStats = await Promise.all([
    MatchPlayerBattingStat.findAll({
      where: {
        matchId: {
          [Op.in]: matchIds.map((m: any) => m.id),
        },
      },
      attributes: [
        'playerId',
        'matchId',
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('points')),
          'totalPoints',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('score')),
          'totalScore',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('balls')),
          'totalBalls',
        ],
      ],
      group: ['playerId', 'matchId'],
      raw: true,
    }),
    MatchPlayerBowlingStat.findAll({
      where: {
        matchId: {
          [Op.in]: matchIds.map((m: any) => m.id),
        },
      },
      attributes: [
        'playerId',
        'matchId',
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('points')),
          'totalPoints',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('wickets')),
          'totalWickets',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('conceded')),
          'totalConceded',
        ],
      ],
      group: ['playerId', 'matchId'],
      raw: true,
    }),
  ]);

  const [battingStats, bowlingStats] = allStats;

  ppls.forEach((ppl: any) => {
    const matchIdsForDate = matchIdsByDate[ppl.date] || [];

    const relevantBattingStats = battingStats.filter((stat: any) =>
      matchIdsForDate.includes(stat.matchId)
    );
    const relevantBowlingStats = bowlingStats.filter((stat: any) =>
      matchIdsForDate.includes(stat.matchId)
    );

    const aggregatedBattingStats = relevantBattingStats.reduce(
      (acc: any, stat: any) => {
        if (!acc[stat.playerId]) {
          acc[stat.playerId] = {
            playerId: stat.playerId,
            totalPoints: 0,
            totalScore: 0,
            totalBalls: 0,
          };
        }
        acc[stat.playerId].totalPoints += stat.totalPoints;
        acc[stat.playerId].totalScore += stat.totalScore;
        acc[stat.playerId].totalBalls += stat.totalBalls;
        return acc;
      },
      {}
    );

    const aggregatedBowlingStats = relevantBowlingStats.reduce(
      (acc: any, stat: any) => {
        if (!acc[stat.playerId]) {
          acc[stat.playerId] = {
            playerId: stat.playerId,
            totalPoints: 0,
            totalWickets: 0,
            totalConceded: 0,
          };
        }
        acc[stat.playerId].totalPoints += stat.totalPoints;
        acc[stat.playerId].totalWickets += stat.totalWickets;
        acc[stat.playerId].totalConceded += stat.totalConceded;
        return acc;
      },
      {}
    );

    const bestBatter = Object.keys(aggregatedBattingStats).length
      ? Object.values(aggregatedBattingStats).reduce(
          (prev: any, current: any) =>
            prev.totalPoints > current.totalPoints ? prev : current
        )
      : null;

    const bestBowler = Object.keys(aggregatedBowlingStats).length
      ? Object.values(aggregatedBowlingStats).reduce(
          (prev: any, current: any) =>
            prev.totalPoints > current.totalPoints ? prev : current
        )
      : null;

    ppl.bestBatter = bestBatter;
    ppl.bestBowler = bestBowler;
  });

  return ppls;
};

export const getOutdoorMatches = async (
  offset: number = 0,
  limit: number = 10
) => {
  const outdoors: any[] = await Match.findAll({
    where: { oppositeTeamId: { [Op.not]: null } },
    attributes: [
      'oppositeTeamId',
      [
        sequelizeConnection.fn('max', sequelizeConnection.col('id')),
        'latestMatchId',
      ],
    ],
    group: ['oppositeTeamId'],
    order: [['latestMatchId', 'DESC']],
    limit: limit,
    offset: offset,
    raw: true,
  });

  const oppositeTeamIds = outdoors.map(
    (outdoor: any) => outdoor.oppositeTeamId
  );

  const matchDetails = await Match.findAll({
    where: { oppositeTeamId: { [Op.in]: oppositeTeamIds } },
    attributes: ['id', 'oppositeTeamId', 'result'],
    raw: true,
  });

  const matchIdsByOppositeTeamId = matchDetails.reduce(
    (acc: any, match: any) => {
      if (!acc[match.oppositeTeamId]) acc[match.oppositeTeamId] = [];
      acc[match.oppositeTeamId].push(match);
      return acc;
    },
    {}
  );

  const allStats = await Promise.all([
    MatchPlayerBattingStat.findAll({
      where: {
        matchId: {
          [Op.in]: matchDetails.map((m: any) => m.id),
        },
      },
      attributes: [
        'playerId',
        'matchId',
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('points')),
          'totalPoints',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('score')),
          'totalScore',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('balls')),
          'totalBalls',
        ],
      ],
      group: ['playerId', 'matchId'],
      raw: true,
    }),
    MatchPlayerBowlingStat.findAll({
      where: {
        matchId: {
          [Op.in]: matchDetails.map((m: any) => m.id),
        },
      },
      attributes: [
        'playerId',
        'matchId',
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('points')),
          'totalPoints',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('wickets')),
          'totalWickets',
        ],
        [
          sequelizeConnection.fn('sum', sequelizeConnection.col('conceded')),
          'totalConceded',
        ],
      ],
      group: ['playerId', 'matchId'],
      raw: true,
    }),
  ]);

  const [battingStats, bowlingStats] = allStats;

  outdoors.forEach((outdoor: any) => {
    const matchesForOppositeTeam =
      matchIdsByOppositeTeamId[outdoor.oppositeTeamId] || [];

    const relevantBattingStats = battingStats.filter((stat: any) =>
      matchesForOppositeTeam.some((match: any) => match.id === stat.matchId)
    );
    const relevantBowlingStats = bowlingStats.filter((stat: any) =>
      matchesForOppositeTeam.some((match: any) => match.id === stat.matchId)
    );

    const aggregatedBattingStats = relevantBattingStats.reduce(
      (acc: any, stat: any) => {
        if (!acc[stat.playerId]) {
          acc[stat.playerId] = {
            playerId: stat.playerId,
            totalPoints: 0,
            totalScore: 0,
            totalBalls: 0,
          };
        }
        acc[stat.playerId].totalPoints += stat.totalPoints;
        acc[stat.playerId].totalScore += stat.totalScore;
        acc[stat.playerId].totalBalls += stat.totalBalls;
        return acc;
      },
      {}
    );

    const aggregatedBowlingStats = relevantBowlingStats.reduce(
      (acc: any, stat: any) => {
        if (!acc[stat.playerId]) {
          acc[stat.playerId] = {
            playerId: stat.playerId,
            totalPoints: 0,
            totalWickets: 0,
            totalConceded: 0,
          };
        }
        acc[stat.playerId].totalPoints += stat.totalPoints;
        acc[stat.playerId].totalWickets += stat.totalWickets;
        acc[stat.playerId].totalConceded += stat.totalConceded;
        return acc;
      },
      {}
    );

    const bestBatter = Object.keys(aggregatedBattingStats).length
      ? Object.values(aggregatedBattingStats).reduce(
          (prev: any, current: any) =>
            prev.totalPoints > current.totalPoints ? prev : current
        )
      : null;

    const bestBowler = Object.keys(aggregatedBowlingStats).length
      ? Object.values(aggregatedBowlingStats).reduce(
          (prev: any, current: any) =>
            prev.totalPoints > current.totalPoints ? prev : current
        )
      : null;

    const totalMatches = matchesForOppositeTeam.length;
    const wonMatches = matchesForOppositeTeam.filter(
      (match: any) => match.result === 'won'
    ).length;
    const winningPercentage =
      totalMatches > 0 ? (wonMatches / totalMatches) * 100 : 0;

    outdoor.bestBatter = bestBatter;
    outdoor.bestBowler = bestBowler;
    outdoor.winningPercentage = winningPercentage;
  });

  return outdoors;
};

export const getMatches = async (
  where: object,
  offset: number = 0,
  limit: number = 0
) => {
  return Match.findAll({
    where: { ...where },
    include: [
      {
        model: OppositeTeam,
        as: 'oppositeTeam',
      },
      {
        model: Player,
        attributes: ['id', 'name', 'avatar'],
        as: 'officialPlayers',
      },
      {
        model: MatchPlayerBattingStat,
        as: 'battingStats',
        include: [
          {
            model: Player,
            attributes: ['id', 'name', 'avatar'],
            as: 'player',
          },
        ],
      },
      {
        model: MatchPlayerBowlingStat,
        as: 'bowlingStats',
        include: [
          {
            model: Player,
            attributes: ['id', 'name', 'avatar'],
            as: 'player',
          },
        ],
      },
      {
        model: MatchPlayerFieldingStat,
        as: 'fieldingStats',
        include: [
          {
            model: Player,
            attributes: ['id', 'name', 'avatar'],
            as: 'player',
          },
        ],
      },
    ],
    order: [['id', 'DESC']],
    limit: limit,
    offset: offset,
  });
};

export const getMatchesCount = async (where: object) => {
  return await Match.count({
    where: { ...where },
  });
};

export const getGroupMatchesCount = async (type: 'ppl' | 'outdoor') => {
  return await Match.count({
    distinct: true,
    where: {
      oppositeTeamId: {
        [type === 'ppl' ? Op.is : Op.not]: null,
      },
    },
    col: type === 'ppl' ? 'date' : 'oppositeTeamId',
  });
};

export const setMatchPlayers = async (match: Match, players: number[]) => {
  const previousRecords = await MatchPlayer.findAll({
    where: { matchId: match.dataValues.id },
  });
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const selectedPlayers = await findPlayers(players);
  return match.setOfficialPlayers(selectedPlayers);
};

export const setMatchPlayersBattingStats = async (
  match: Match,
  players: {
    id: number;
    score?: number;
    balls: number;
    sixes?: number;
    fours?: number;
    isOut?: boolean;
    strikeRate: number;
    points: number;
  }[]
) => {
  const previousRecords = await match.getBattingStats();
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const playersStats = players.map((player) => ({
    playerId: player.id,
    score: player.score,
    balls: player.balls,
    sixes: player.sixes,
    fours: player.fours,
    isOut: player.isOut,
    strikeRate: player.strikeRate,
    points: player.points,
  }));
  return await Promise.all(
    playersStats.map(async (stat) => {
      return await match.createBattingStat(stat as MatchPlayerBattingStat);
    })
  );
};

export const setMatchPlayersBowlingStats = async (
  match: Match,
  players: {
    id: number;
    wickets?: number;
    overs: number;
    conceded?: number;
    maidens?: number;
    economy: number;
    points: number;
  }[]
) => {
  const previousRecords = await match.getBowlingStats();
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const playersStats = players.map((player) => ({
    playerId: player.id,
    wickets: player.wickets,
    overs: player.overs,
    conceded: player.conceded,
    maidens: player.maidens,
    economy: player.economy,
    points: player.points,
  }));
  return await Promise.all(
    playersStats.map(async (stat) => {
      return await match.createBowlingStat(stat as MatchPlayerBowlingStat);
    })
  );
};

export const setMatchPlayersFieldingStats = async (
  match: Match,
  players: {
    id: number;
    catches?: number;
    stumps?: number;
    directHits?: number;
    indirectHits?: number;
    points: number;
  }[]
) => {
  const previousRecords = await match.getFieldingStats();
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const playersStats = players.map((player) => ({
    playerId: player.id,
    catches: player.catches,
    stumps: player.stumps,
    directHits: player.directHits,
    indirectHits: player.indirectHits,
    points: player.points,
  }));
  return await Promise.all(
    playersStats.map(async (stat) => {
      return await match.createFieldingStat(stat as MatchPlayerFieldingStat);
    })
  );
};
