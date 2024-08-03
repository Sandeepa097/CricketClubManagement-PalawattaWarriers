import { hashPassword } from '../../services/authService';
import { createUser } from '../../services/userService';

type argumentTypes = 'username' | 'password' | 'userType';
interface UserDetails {
  username: string | undefined;
  password: string | undefined;
  userType: string | undefined;
}

const getUser = () => {
  const user: UserDetails = {
    username: undefined,
    password: undefined,
    userType: undefined,
  };

  process.argv.forEach((arg: string) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2);
      const longArgValue = longArg[1];
      user[longArgFlag as argumentTypes] = longArgValue;
    }
  });

  return user;
};

const createUserOnDB = async (user: UserDetails) => {
  if (!user.username) return console.error('\nUsername is required.');
  if (!user.userType) return console.error('\nUser Type is required.');
  if (!user.password) return console.error('\nPassword is required.');

  const hashedPassword = await hashPassword(user.password);
  createUser({
    username: user.username,
    userType: user.userType,
    passwordHash: hashedPassword,
  });

  console.log('User is created successfully.');
};

const user = getUser();
createUserOnDB(user);
