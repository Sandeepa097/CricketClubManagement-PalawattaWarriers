import express, { Application, Request, Response } from 'express';
const cors = require('cors');
import * as bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import {
  CLOUDINARY_CLOUD,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  NODE_ENV,
} from './config/config';
import router from './routes';

const sequelize = require('./models').sequelize;
const cloudinary = require('cloudinary').v2;

const app: Application = express();

sequelize
  .authenticate()
  .then(() => {
    if (NODE_ENV !== 'test')
      console.log('Database connection has been established successfully.');
  })
  .catch((error: string) =>
    console.error('Unable to connect to the database:', error)
  );

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Palawatta Warriers Server' });
});

app.use('/api', router);

app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Unknown endpoint' });
});

export default app;
