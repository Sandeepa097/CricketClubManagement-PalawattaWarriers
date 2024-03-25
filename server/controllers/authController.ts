import { Request, Response } from 'express';
import { findUser } from '../services/userService';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';

export const login = async (req: Request, res: Response) => {
  const authUser = await findUser({
    username: req.body.username,
    scope: 'withPasswordHash',
  });

  if (!authUser)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Username is invalid.' });

  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    authUser.dataValues.passwordHash
  );

  if (!isCorrectPassword)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Password is invalid.' });

  const userForToken = {
    id: authUser.dataValues.id,
    userType: authUser.dataValues.userType,
    username: authUser.dataValues.username,
  };

  const token = generateToken(userForToken);

  return res.status(StatusCodes.OK).json({
    user: {
      id: userForToken.id,
      userType: userForToken.userType,
      token,
    },
  });
};
