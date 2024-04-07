import { Op } from 'sequelize';
import {
  Match,
  MatchPlayer,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
  MatchPlayerFieldingStat,
} from '../models';
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

export const setMatchPlayers = async (match: Match, players: number[]) => {
  const previousRecords = await MatchPlayer.findAll({
    where: { matchId: match.dataValues.id },
  });
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const selectedPlayers = await findPlayers(players);
  return match.setPlayers(selectedPlayers);
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
    points: number;
  }[]
) => {
  const previousRecords = await match.getMatchPlayerBattingStats();
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
    points: player.points,
  }));
  return await Promise.all(
    playersStats.map(async (stat) => {
      return await match.createMatchPlayerBattingStat(
        stat as MatchPlayerBattingStat
      );
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
    points: number;
  }[]
) => {
  const previousRecords = await match.getMatchPlayerBowlingStats();
  for (let i = 0; i < previousRecords.length; i++) {
    await previousRecords[i].destroy();
  }

  const playersStats = players.map((player) => ({
    playerId: player.id,
    wickets: player.wickets,
    overs: player.overs,
    conceded: player.conceded,
    maidens: player.maidens,
    points: player.points,
  }));
  return await Promise.all(
    playersStats.map(async (stat) => {
      return await match.createMatchPlayerBowlingStat(
        stat as MatchPlayerBowlingStat
      );
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
  const previousRecords = await match.getMatchPlayerFieldingStats();
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
      return await match.createMatchPlayerFieldingStat(
        stat as MatchPlayerFieldingStat
      );
    })
  );
};
