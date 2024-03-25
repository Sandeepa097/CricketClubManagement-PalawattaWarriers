import { NextFunction, Request, Response } from 'express';
import {
  ValidationChain,
  matchedData,
  validationResult,
} from 'express-validator';
import { StatusCodes } from 'http-status-codes';

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
