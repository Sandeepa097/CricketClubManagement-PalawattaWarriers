import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface OppositeTeamInstance extends Model {
  name: string;
}

class OppositeTeam extends Model implements OppositeTeamInstance {
  public name!: string;

  static associate(models: any) {
    // define association here
  }
}

OppositeTeam.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'OppositeTeam',
  }
);

export default OppositeTeam;
