import { Request, Response } from 'express';
import {
  createOppositeTeam,
  getOppositeTeams,
} from '../services/oppositeTeamService';
import { StatusCodes } from 'http-status-codes';

const create = async (req: Request, res: Response) => {
  const { name } = req.body;

  const createdOppositeTeam = await createOppositeTeam({ name });

  return res.status(StatusCodes.CREATED).json({
    message: 'Opposite team created successfully.',
    oppositeTeam: createdOppositeTeam,
  });
};

const get = async (req: Request, res: Response) => {
  const oppositeTeams = await getOppositeTeams();

  return res.status(StatusCodes.CREATED).json({
    oppositeTeams,
  });
};

export default { create, get };
