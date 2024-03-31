import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import Player from './Player';
import MatchPlayer from './MatchPlayer';

interface MatchInstance extends Model {
  oppositeTeamId?: number | null;
  date: string;
  location: string;
  result?: string | null;
  numberOfDeliveriesPerOver?: number;
}

class Match extends Model implements MatchInstance {
  public oppositeTeamId?: number | null | undefined;
  public date!: string;
  public location!: string;
  public result?: string | null | undefined;
  public numberOfDeliveriesPerOver?: number | undefined;

  public setMatchPlayers!: (players: Player[]) => Promise<void>;
  public setMatchPlayersBattingStats!: (
    players: { id: number; through: { points: number } }[]
  ) => Promise<void>;
  public setMatchPlayersBowlingStats!: (
    players: { id: number; through: { points: number } }[]
  ) => Promise<void>;
  public setMatchPlayersFieldingStats!: (
    players: { id: number; through: { points: number } }[]
  ) => Promise<void>;

  static associate(models: any) {
    Match.belongsToMany(Player, {
      through: MatchPlayer,
      as: 'OfficialPlayers',
    });
  }
}

Match.init(
  {
    oppositeTeamId: DataTypes.INTEGER.UNSIGNED,
    date: DataTypes.STRING,
    location: DataTypes.STRING,
    result: DataTypes.STRING,
    numberOfDeliveriesPerOver: DataTypes.INTEGER.UNSIGNED,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Match',
  }
);

export default Match;
