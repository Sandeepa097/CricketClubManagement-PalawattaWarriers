import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface PaymentInstance extends Model {
  playerId: number;
  amount: number;
}

class Payment extends Model implements PaymentInstance {
  public playerId!: number;
  public amount!: number;

  static associate(models: any) {
    // define association here
  }
}

Payment.init(
  {
    playerId: DataTypes.INTEGER.UNSIGNED,
    amount: DataTypes.INTEGER,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Payment',
  }
);

export default Payment;
