import { Model, DataTypes } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface PPLGroupInstance extends Model {
  id: string;
  title?: string | null;
}

class PPLGroup extends Model implements PPLGroupInstance {
  public id!: string;
  public title?: string | null | undefined;
}

PPLGroup.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: DataTypes.STRING,
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'PPLGroup',
  },
);

export default PPLGroup;
