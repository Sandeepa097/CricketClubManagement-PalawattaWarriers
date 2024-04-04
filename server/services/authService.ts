import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  SALT_ROUNDS,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED_IN,
  REFRESH_TOKEN_EXPIRED_IN,
  REFRESH_TOKEN_SECRET,
} from '../config/config';

interface AuthTokenAttributes {
  id: number;
  userType: string;
  username: string;
}

export const generateAccessToken = (
  authTokenAttributes: AuthTokenAttributes
) => {
  return jwt.sign(authTokenAttributes, ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRED_IN,
  });
};

export const generateRefreshToken = (
  authTokenAttributes: AuthTokenAttributes
) => {
  return jwt.sign(authTokenAttributes, REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRED_IN,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const decodeAccessToken = (
  token: string
): AuthTokenAttributes | null => {
  try {
    return jwt.verify(
      token,
      ACCESS_TOKEN_SECRET as string
    ) as AuthTokenAttributes;
  } catch (error) {
    return null;
  }
};

export const decodeRefreshToken = (
  token: string
): AuthTokenAttributes | null => {
  try {
    return jwt.verify(
      token,
      REFRESH_TOKEN_SECRET as string
    ) as AuthTokenAttributes;
  } catch (error) {
    return null;
  }
};
