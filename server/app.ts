import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Palawatta Warriers Server' });
});

export default app;
