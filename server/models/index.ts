import User from './User';
import Player from './Player';
import OppositeTeam from './OppositeTeam';
import Match from './Match';
import MatchPlayer from './MatchPlayer';
import MatchPlayerBattingStat from './MatchPlayerBattingStat';
import MatchPlayerBowlingStat from './MatchPlayerBowlingStat';
import MatchPlayerFieldingStat from './MatchPlayerFieldingStat';

// Opposite team
Match.belongsTo(OppositeTeam, {
  foreignKey: 'oppositeTeamId',
  as: 'oppositeTeam',
});

// Match players
Match.belongsToMany(Player, {
  through: MatchPlayer,
  foreignKey: 'matchId',
  as: 'officialPlayers',
});
Player.belongsToMany(Match, {
  through: MatchPlayer,
  foreignKey: 'playerId',
  as: 'playedMatches',
});

// Batting stats
Match.hasMany(MatchPlayerBattingStat, {
  foreignKey: 'matchId',
  as: 'battingStats',
});
Player.hasMany(MatchPlayerBattingStat, {
  foreignKey: 'playerId',
  as: 'battingStats',
});
MatchPlayerBattingStat.belongsTo(Player, {
  foreignKey: 'playerId',
  as: 'player',
});
MatchPlayerBattingStat.belongsTo(Match, {
  foreignKey: 'matchId',
  as: 'match',
});

// Bowling stats
Match.hasMany(MatchPlayerBowlingStat, {
  foreignKey: 'matchId',
  as: 'bowlingStats',
});
Player.hasMany(MatchPlayerBowlingStat, {
  foreignKey: 'playerId',
  as: 'bowlingStats',
});
MatchPlayerBowlingStat.belongsTo(Player, {
  foreignKey: 'playerId',
  as: 'player',
});
MatchPlayerBowlingStat.belongsTo(Match, {
  foreignKey: 'matchId',
  as: 'match',
});

// Fielding stats
Match.hasMany(MatchPlayerFieldingStat, {
  foreignKey: 'matchId',
  as: 'fieldingStats',
});
Player.hasMany(MatchPlayerFieldingStat, {
  foreignKey: 'playerId',
  as: 'fieldingStats',
});
MatchPlayerFieldingStat.belongsTo(Player, {
  foreignKey: 'playerId',
  as: 'player',
});
MatchPlayerFieldingStat.belongsTo(Match, {
  foreignKey: 'matchId',
  as: 'match',
});

export {
  User,
  Player,
  OppositeTeam,
  Match,
  MatchPlayer,
  MatchPlayerBattingStat,
  MatchPlayerBowlingStat,
  MatchPlayerFieldingStat,
};
