import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from './validator';
import { login } from '../controllers/authController';

const authRouter = Router();

authRouter.post(
  '/login',
  validateRequest([
    body('username').not().isEmpty().withMessage('Username is required.'),
    body('password').not().isEmpty().withMessage('Password is required.'),
  ]),
  login
);

export default authRouter;
