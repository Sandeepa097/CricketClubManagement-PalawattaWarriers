import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const sequelize = require('./models').sequelize;

const app: Application = express();

sequelize
  .authenticate()
  .then(() => {
    if (process.env.NODE_ENV !== 'test')
      console.log('Database connection has been established successfully.');
  })
  .catch((error: string) =>
    console.error('Unable to connect to the database:', error)
  );

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Palawatta Warriers Server' });
});

export default app;
