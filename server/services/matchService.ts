import { Op } from 'sequelize';
import { Match, Player } from '../models';
import { findPlayer, findPlayers } from './playerService';

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

export const setMatchPlayers = async (match: Match, players: number[]) => {
  const selectedPlayers = await findPlayers(players);

  return match.setPlayers(selectedPlayers);
};

export const setMatchPlayersBattingStats = async (
  match: Match,
  players: { id: number; points: number }[]
) => {
  return players.map(async (player) => {
    const selectedPlayer = await findPlayer(player.id);
    return player
      ? match.setMatchPlayerBattingStats(selectedPlayer as Player, {
          points: player.points,
        })
      : null;
  });
};

export const setMatchPlayersBowlingStats = async (
  match: Match,
  players: { id: number; points: number }[]
) => {
  return match.setMatchPlayerBowlingStats(
    players.map((player) => ({
      id: player.id,
      through: { points: player.points },
    }))
  );
};

export const setMatchPlayersFieldingStats = async (
  match: Match,
  players: { id: number; points: number }[]
) => {
  return match.setMatchPlayerFieldingStats(
    players.map((player) => ({
      id: player.id,
      through: { points: player.points },
    }))
  );
};
