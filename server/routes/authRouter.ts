import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from './validator';
import authController from '../controllers/authController';

const authRouter = Router();

authRouter.post(
  '/login',
  validateRequest([
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ]),
  authController.login
);

export default authRouter;
