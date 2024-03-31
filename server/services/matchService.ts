import { Op } from 'sequelize';
import { Match, Player } from '../models';
import { findPlayers } from './playerService';

interface CreateMatchAttributes {
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
  return await Match.findOne({ where: { id } });
};

export const removeMatch = async (id: number) => {
  return await Match.destroy({ where: { id } });
};

export const getPPLMatches = async () => {
  return await Match.findAll({ where: { oppositeTeamId: { [Op.is]: null } } });
};

export const getOutdoorMatches = async () => {
  return await Match.findAll({
    where: { oppositeTeamId: { [Op.not]: null } },
    group: ['oppositeTeamId'],
  });
};

export const setMatchPlayers = async (id: number, players: number[]) => {
  const selectedPlayers = await findPlayers(players);
  const match = await findMatch(id);

  return match?.setMatchPlayers(selectedPlayers);
};

export const setMatchPlayersBattingStats = async (
  id: number,
  players: { id: number; points: number }[]
) => {
  const match = await findMatch(id);

  return match?.setMatchPlayersBattingStats(
    players.map((player) => ({
      id: player.id,
      through: { points: player.points },
    }))
  );
};

export const setMatchPlayersBowlingStats = async (
  id: number,
  players: { id: number; points: number }[]
) => {
  const match = await findMatch(id);

  return match?.setMatchPlayersBowlingStats(
    players.map((player) => ({
      id: player.id,
      through: { points: player.points },
    }))
  );
};

export const setMatchPlayersFieldingStats = async (
  id: number,
  players: { id: number; points: number }[]
) => {
  const match = await findMatch(id);

  return match?.setMatchPlayersFieldingStats(
    players.map((player) => ({
      id: player.id,
      through: { points: player.points },
    }))
  );
};
