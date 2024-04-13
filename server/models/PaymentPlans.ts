import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface PaymentPlanInstance extends Model {
  fee: number;
  effectiveMonth: number;
  effectiveYear: number;
}

class PaymentPlan extends Model implements PaymentPlanInstance {
  public fee!: number;
  public effectiveMonth!: number;
  public effectiveYear!: number;

  static associate(models: any) {
    // define association here
  }
}

PaymentPlan.init(
  {
    fee: DataTypes.INTEGER.UNSIGNED,
    effectiveMonth: DataTypes.INTEGER,
    effectiveYear: DataTypes.INTEGER,
    effectiveFrom: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return {
          month: this.getDataValue('effectiveMonth'),
          year: this.getDataValue('effectiveYear'),
        };
      },
      set: function (effectiveFrom: { month: number; year: number }) {
        this.setDataValue('effectiveMonth', effectiveFrom.month);
        this.setDataValue('effectiveYear', effectiveFrom.year);
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'PaymentPlan',
  }
);

export default PaymentPlan;
