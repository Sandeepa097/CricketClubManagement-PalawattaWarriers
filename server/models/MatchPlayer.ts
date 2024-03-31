import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface MatchPlayerInstance extends Model {
  matchId: number;
  playerId: number;
}

class MatchPlayer extends Model implements MatchPlayerInstance {
  public matchId!: number;
  public playerId!: number;

  static associate(models: any) {
    // define association here
  }
}

MatchPlayer.init(
  {
    matchId: DataTypes.INTEGER.UNSIGNED,
    playerId: DataTypes.INTEGER.UNSIGNED,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayer',
  }
);

export default MatchPlayer;
