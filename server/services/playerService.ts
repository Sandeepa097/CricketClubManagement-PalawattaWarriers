import { Op } from 'sequelize';
import { PlayerMainRolls } from '../constants/PlayerMainRolls';
import {
  Match,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
  OppositeTeam,
  Player,
} from '../models';
import sequelizeConnection from '../config/sequelizeConnection';

interface CreatePlayerAttributes {
  avatar?: string | null;
  name: string;
  mainRoll: PlayerMainRolls;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  feesPayingSince: {
    month: number;
    year: number;
  };
}

export const createPlayer = async (player: CreatePlayerAttributes) => {
  return await Player.create({ ...player });
};

export const updatePlayer = async (
  id: number,
  player: CreatePlayerAttributes
) => {
  return await Player.update(player, { where: { id } });
};

export const findPlayer = async (id: number) => {
  return await Player.findOne({ where: { id } });
};

export const findPlayers = async (ids: number[]) => {
  return await Player.findAll({ where: { id: { [Op.in]: ids } } });
};

export const removePlayer = async (id: number) => {
  return await Player.destroy({ where: { id } });
};

export const getPlayers = async () => {
  return await Player.findAll();
};

export const getPlayerBattingStats = async (
  playerId: number | string,
  matchType: 'ppl' | 'outdoor'
) => {
  const bestScore = await MatchPlayerBattingStat.findOne({
    where: { playerId },
    attributes: [
      'playerId',
      'balls',
      'isOut',
      [
        sequelizeConnection.fn('MAX', sequelizeConnection.col('score')),
        'score',
      ],
    ],
    group: ['playerId', 'balls', 'isOut'],
    include: [
      {
        model: Match,
        as: 'match',
        attributes: ['id', 'oppositeTeamId', 'date', 'location'],
        where: {
          oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
        },
        include: [
          {
            model: OppositeTeam,
            as: 'oppositeTeam',
            attributes: ['name'],
          },
        ],
      },
    ],
    order: sequelizeConnection.literal('score DESC'),
  });

  const averageStrikeRate = (
    await MatchPlayerBattingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('AVG', sequelizeConnection.col('strikeRate')),
          'strikeRate',
        ],
      ],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues.strikeRate;

  const totalScore = (
    await MatchPlayerBattingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('SUM', sequelizeConnection.col('score')),
          'score',
        ],
      ],
      group: ['playerId'],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues?.score;

  const totalBalls = (
    await MatchPlayerBattingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('SUM', sequelizeConnection.col('balls')),
          'balls',
        ],
      ],
      group: ['playerId'],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues?.balls;

  const dismissedCount = (
    await MatchPlayerBattingStat.findOne({
      where: { playerId, isOut: true },
      attributes: [
        [
          sequelizeConnection.fn('COUNT', sequelizeConnection.col('isOut')),
          'dismissedCount',
        ],
      ],
      group: ['playerId'],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues?.dismissedCount;

  return {
    bestScore,
    averageStrikeRate,
    totalScore,
    totalBalls,
    dismissedCount,
  };
};

export const getPlayerBowlingStats = async (
  playerId: number | string,
  matchType: 'ppl' | 'outdoor'
) => {
  const bestScore = await MatchPlayerBowlingStat.findOne({
    where: { playerId },
    attributes: [
      'playerId',
      'conceded',
      [
        sequelizeConnection.fn('MAX', sequelizeConnection.col('wickets')),
        'wickets',
      ],
    ],
    group: ['playerId', 'conceded'],
    include: [
      {
        model: Match,
        as: 'match',
        attributes: ['id', 'oppositeTeamId', 'date', 'location'],
        where: {
          oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
        },
        include: [
          {
            model: OppositeTeam,
            as: 'oppositeTeam',
            attributes: ['name'],
          },
        ],
      },
    ],
    order: sequelizeConnection.literal('wickets DESC'),
  });

  const averageEconomy = (
    await MatchPlayerBowlingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('AVG', sequelizeConnection.col('economy')),
          'economy',
        ],
      ],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues.economy;

  const totalWickets = (
    await MatchPlayerBowlingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('SUM', sequelizeConnection.col('wickets')),
          'wickets',
        ],
      ],
      group: ['playerId'],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues?.wickets;

  const totalConceded = (
    await MatchPlayerBowlingStat.findOne({
      where: { playerId },
      attributes: [
        [
          sequelizeConnection.fn('SUM', sequelizeConnection.col('conceded')),
          'conceded',
        ],
      ],
      group: ['playerId'],
      include: [
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues?.conceded;

  return { bestScore, averageEconomy, totalWickets, totalConceded };
};

export const getPlayerMatchesCount = async (
  playerId: number | string,
  matchType: 'ppl' | 'outdoor'
) => {
  const matchesCount = (
    await Player.findOne({
      subQuery: false,
      where: { id: playerId },
      attributes: [
        [
          sequelizeConnection.fn(
            'COUNT',
            sequelizeConnection.col('playedMatches.id')
          ),
          'matchesCount',
        ],
      ],
      include: [
        {
          model: Match,
          as: 'playedMatches',
          attributes: ['id', 'oppositeTeamId'],
          where: {
            oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
          },
        },
      ],
    })
  )?.dataValues.matchesCount;

  return matchesCount;
};
