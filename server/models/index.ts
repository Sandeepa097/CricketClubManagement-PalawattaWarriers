import User from './User';
import Player from './Player';
import OppositeTeam from './OppositeTeam';
import Match from './Match';
import MatchPlayer from './MatchPlayer';
import MatchPlayerBattingStat from './MatchPlayerBattingStat';
import MatchPlayerBowlingStat from './MatchPlayerBowlingStat';
import MatchPlayerFieldingStat from './MatchPlayerFieldingStat';

// Match players
Match.belongsToMany(Player, { through: MatchPlayer, foreignKey: 'matchId' });
Player.belongsToMany(Match, { through: MatchPlayer, foreignKey: 'playerId' });

// Batting stats
Match.hasMany(MatchPlayerBattingStat, { foreignKey: 'matchId' });
Player.hasMany(MatchPlayerBattingStat, { foreignKey: 'playerId' });

// Bowling stats
Match.hasMany(MatchPlayerBowlingStat, { foreignKey: 'matchId' });
Player.hasMany(MatchPlayerBowlingStat, { foreignKey: 'playerId' });

// Fielding stats
Match.hasMany(MatchPlayerFieldingStat, { foreignKey: 'matchId' });
Player.hasMany(MatchPlayerFieldingStat, { foreignKey: 'playerId' });

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
