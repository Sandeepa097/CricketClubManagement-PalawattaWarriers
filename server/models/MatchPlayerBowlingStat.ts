import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface MatchPlayerBowlingStatInstance extends Model {
  matchId: number;
  playerId: number;
  wickets: number;
  overs: number;
  conceded: number;
  maidens: number;
  economy: number;
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
  public economy!: number;
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
    overs: DataTypes.DECIMAL(3, 1).UNSIGNED,
    conceded: DataTypes.INTEGER.UNSIGNED,
    maidens: DataTypes.INTEGER.UNSIGNED,
    economy: DataTypes.DECIMAL(6, 3).UNSIGNED,
    points: DataTypes.INTEGER,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayerBowlingStat',
  }
);

export default MatchPlayerBowlingStat;
