import { Op } from 'sequelize';
import { PlayerMainRolls } from '../constants/PlayerMainRolls';
import { Player } from '../models';

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
