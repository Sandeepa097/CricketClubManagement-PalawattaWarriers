import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface PlayerInstance extends Model {
  avatar: string;
  name: string;
  mainRoll: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  feesPayingMonth: number;
  feesPayingYear: number;
}

class Player extends Model implements PlayerInstance {
  public avatar!: string;
  public name!: string;
  public mainRoll!: string;
  public isCaptain!: boolean;
  public isWicketKeeper!: boolean;
  public feesPayingMonth!: number;
  public feesPayingYear!: number;

  static associate(models: any) {
    // define association here
  }
}

Player.init(
  {
    avatar: DataTypes.STRING,
    name: DataTypes.STRING,
    mainRoll: DataTypes.STRING,
    isCaptain: DataTypes.BOOLEAN,
    isWicketKeeper: DataTypes.BOOLEAN,
    feesPayingMonth: DataTypes.INTEGER,
    feesPayingYear: DataTypes.INTEGER,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Player',
    getterMethods: {
      feesPayingSince: function () {
        return {
          month: this.getDataValue('feesPayingMonth'),
          year: this.getDataValue('feesPayingYear'),
        };
      },
    },
  }
);

export default Player;
