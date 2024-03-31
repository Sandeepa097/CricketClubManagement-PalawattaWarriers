import { NextFunction, Request, Response } from 'express';
import {
  ValidationChain,
  matchedData,
  validationResult,
} from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { decodeAccessToken, decodeRefreshToken } from '../services/authService';

export const validateRequest =
  (rules: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const validatedBody = matchedData(req, { locations: ['body'] });

      req.body = validatedBody;
      return next();
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Bad request', errors: errors.array() });
  };

export const validatePermissions =
  (authorizedUserType: string | string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer '))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Not authenticated.' });

    const authUser = decodeAccessToken(authHeader.substring(7));
    const isArray = Array.isArray(authorizedUserType);
    if (isArray && authorizedUserType.includes(authUser.userType))
      return next();

    if (!isArray && authUser.userType === authorizedUserType) return next();

    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: 'No permissions.' });
  };

export const validateRefreshToken =
  () => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer '))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Not authenticated.' });

    const authUser = decodeRefreshToken(authHeader.substring(7));

    if (authUser && authUser.id) {
      req.body = { ...req.body, id: authUser.id };
      return next();
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Not authenticated.' });
  };
