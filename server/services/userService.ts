import { User } from '../models';
import { UserScope } from '../models/User';

interface FindUserByIdAttributes {
  scope?: UserScope;
  id: number;
}

interface FindUserByUsernameAttributes {
  scope?: UserScope;
  username: string;
}

interface CreateUserAttributes {
  username: string;
  userType: string;
  passwordHash: string;
}

export const createUser = async (user: CreateUserAttributes) => {
  return await User.create({ ...user });
};

export const findUser = async (
  payload: FindUserByIdAttributes | FindUserByUsernameAttributes
) => {
  return await User.scope(payload.scope).findOne({
    where: (payload as FindUserByIdAttributes).id
      ? { id: (payload as FindUserByIdAttributes).id }
      : { username: (payload as FindUserByUsernameAttributes).username },
  });
};
