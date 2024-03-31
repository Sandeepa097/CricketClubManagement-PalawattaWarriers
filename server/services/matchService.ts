import { Match } from '../models';
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

export const findMatch = async (id: number) => {
  return await Match.findOne({ where: { id } });
};

export const setMatchPlayers = async (id: number, players: number[]) => {
  const selectedPlayers = await findPlayers(players);
  const match = await findMatch(id);

  return match?.setMatchPlayers(selectedPlayers);
};

export const setMatchPlayersBattingStats = async () => {};
