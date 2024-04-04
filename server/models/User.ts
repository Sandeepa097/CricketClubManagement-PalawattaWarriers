import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

export type UserScope = 'withPasswordHash';

interface UserInstance extends Model {
  username: string;
  userType: string;
  passwordHash: string;
}

class User extends Model implements UserInstance {
  public username!: string;
  public userType!: string;
  public passwordHash!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
  }
}

User.init(
  {
    username: DataTypes.STRING,
    userType: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      withPasswordHash: {
        attributes: { exclude: [] },
      },
    },
  }
);

export default User;
