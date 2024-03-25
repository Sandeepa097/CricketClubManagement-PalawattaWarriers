import { Sequelize, Dialect } from 'sequelize';
import {
  DB_DATABASE,
  DB_DIALECT,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from './config';

const sequelizeConnection = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT as Dialect,
});

export default sequelizeConnection;
