import { Op } from 'sequelize';
import { PlayerMainRolls } from '../constants/PlayerMainRolls';
import {
  Match,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
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
        attributes: ['id', 'oppositeTeamId'],
        where: {
          oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
        },
      },
    ],
    order: sequelizeConnection.literal('score DESC'),
  });

  return { bestScore };
};

export const getPlayerBowlingStats = async (
  playerId: number | string,
  matchType: 'ppl' | 'outdoor'
) => {
  const bestScore = await MatchPlayerBowlingStat.findOne({
    where: { playerId },
    attributes: [
      'playerId',
      'overs',
      [
        sequelizeConnection.fn('MAX', sequelizeConnection.col('wickets')),
        'wickets',
      ],
    ],
    group: ['playerId', 'overs'],
    include: [
      {
        model: Match,
        as: 'match',
        attributes: ['id', 'oppositeTeamId', 'numberOfDeliveriesPerOver'],
        where: {
          oppositeTeamId: { [matchType === 'ppl' ? Op.is : Op.not]: null },
        },
      },
    ],
    order: sequelizeConnection.literal('wickets DESC'),
  });

  return { bestScore };
};
