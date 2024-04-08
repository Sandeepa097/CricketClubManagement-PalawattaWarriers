import { Router } from 'express';
import { body } from 'express-validator';
import { validatePermissions, validateRequest } from './validator';
import { UserTypes } from '../constants/UserTypes';
import { findOppositeTeam } from '../services/oppositeTeamService';
import oppositeTeamController from '../controllers/oppositeTeamController';

const oppositeTeamRouter = Router();

oppositeTeamRouter.post(
  '/',
  validatePermissions(UserTypes.ADMIN),
  validateRequest([
    body('name')
      .notEmpty()
      .withMessage('Name is required.')
      .custom(async (value) => {
        const oppositeTeam = await findOppositeTeam({ name: value });
        if (oppositeTeam) throw Error('Opposite team already exists.');
        return true;
      }),
  ]),
  oppositeTeamController.create
);

oppositeTeamRouter.get('/', oppositeTeamController.get);

export default oppositeTeamRouter;
