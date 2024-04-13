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
  strikeRate: number;
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
  public strikeRate!: number;
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
    strikeRate: DataTypes.DECIMAL(7, 3).UNSIGNED,
    points: DataTypes.INTEGER,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'MatchPlayerBattingStat',
  }
);

export default MatchPlayerBattingStat;
