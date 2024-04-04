import { Request, Response } from 'express';
import { findUser } from '../services/userService';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../services/authService';

const login = async (req: Request, res: Response) => {
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

  const accessToken = generateAccessToken(userForToken);
  const refreshToken = generateRefreshToken(userForToken);

  return res.status(StatusCodes.OK).json({
    user: {
      id: userForToken.id,
      userType: userForToken.userType,
      accessToken,
      refreshToken,
    },
  });
};

const newAccessToken = async (req: Request, res: Response) => {
  const authUser = await findUser({
    id: req.body.id,
  });

  if (!authUser)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'User not found.' });

  const userForToken = {
    id: authUser.dataValues.id,
    userType: authUser.dataValues.userType,
    username: authUser.dataValues.username,
  };

  const accessToken = generateAccessToken(userForToken);

  return res.status(StatusCodes.CREATED).json({
    accessToken,
  });
};

export default { login, newAccessToken };
