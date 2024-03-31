import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface MatchPlayerBattingStatInstance extends Model {
  matchId: number;
  playerId: number;
  score: number;
  balls: number;
  sixes: number;
  fours: number;
  isOut: boolean;
  points: number;
}

class MatchPlayerBattingStat
  extends Model
  implements MatchPlayerBattingStatInstance
{
  public matchId!: number;
  public playerId!: number;
  public score!: number;
  public balls!: number;
  public sixes!: number;
  public fours!: number;
  public isOut!: boolean;
  public points!: number;

  static associate(models: any) {
    // define association here
  }
}

MatchPlayerBattingStat.init(
  {
    matchId: DataTypes.INTEGER.UNSIGNED,
    playerId: DataTypes.INTEGER.UNSIGNED,
    score: DataTypes.INTEGER.UNSIGNED,
    balls: DataTypes.INTEGER.UNSIGNED,
    sixes: DataTypes.INTEGER.UNSIGNED,
    fours: DataTypes.INTEGER.UNSIGNED,
    isOut: DataTypes.BOOLEAN,
    points: DataTypes.INTEGER.UNSIGNED,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayerBattingStat',
  }
);

export default MatchPlayerBattingStat;
