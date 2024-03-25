import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, TOKEN_SECRET } from '../config/config';

interface AuthTokenAttributes {
  id: number;
  userType: string;
  username: string;
}

export const generateToken = (authTokenAttributes: AuthTokenAttributes) => {
  return jwt.sign(authTokenAttributes, TOKEN_SECRET as string, {
    expiresIn: '3d',
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};
