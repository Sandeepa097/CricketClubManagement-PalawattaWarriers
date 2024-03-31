import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface MatchPlayerFieldingStatInstance extends Model {
  matchId: number;
  playerId: number;
  catches: number;
  stumps: number;
  directHits: number;
  indirectHits: number;
  points: number;
}

class MatchPlayerFieldingStat
  extends Model
  implements MatchPlayerFieldingStatInstance
{
  public matchId!: number;
  public playerId!: number;
  public catches!: number;
  public stumps!: number;
  public directHits!: number;
  public indirectHits!: number;
  public points!: number;

  static associate(models: any) {
    // define association here
  }
}

MatchPlayerFieldingStat.init(
  {
    matchId: DataTypes.INTEGER.UNSIGNED,
    playerId: DataTypes.INTEGER.UNSIGNED,
    catches: DataTypes.INTEGER.UNSIGNED,
    stumps: DataTypes.INTEGER.UNSIGNED,
    directHits: DataTypes.INTEGER.UNSIGNED,
    indirectHits: DataTypes.INTEGER.UNSIGNED,
    points: DataTypes.INTEGER,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayerFieldingStat',
  }
);

export default MatchPlayerFieldingStat;
