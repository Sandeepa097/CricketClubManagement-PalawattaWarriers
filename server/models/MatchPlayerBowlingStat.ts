import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface MatchPlayerBowlingStatInstance extends Model {
  matchId: number;
  playerId: number;
  wickets: number;
  overs: number;
  conceded: number;
  maidens: number;
  points: number;
}

class MatchPlayerBowlingStat
  extends Model
  implements MatchPlayerBowlingStatInstance
{
  public matchId!: number;
  public playerId!: number;
  public wickets!: number;
  public overs!: number;
  public conceded!: number;
  public maidens!: number;
  public points!: number;

  static associate(models: any) {
    // define association here
  }
}

MatchPlayerBowlingStat.init(
  {
    matchId: DataTypes.INTEGER.UNSIGNED,
    playerId: DataTypes.INTEGER.UNSIGNED,
    wickets: DataTypes.INTEGER.UNSIGNED,
    overs: DataTypes.DECIMAL(undefined, 1).UNSIGNED,
    conceded: DataTypes.INTEGER.UNSIGNED,
    maidens: DataTypes.INTEGER.UNSIGNED,
    points: DataTypes.INTEGER.UNSIGNED,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayerBowlingStat',
  }
);

export default MatchPlayerBowlingStat;
