import { hashPassword } from '../services/authService';
import { updateUser } from '../services/userService';

type argumentTypes = 'username' | 'password';
interface UserDetails {
  username: string | undefined;
  password: string | undefined;
}

const getUser = () => {
  const user: UserDetails = {
    username: undefined,
    password: undefined,
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

const updateUserOnDB = async (user: UserDetails) => {
  if (!user.username) return console.error('\nUsername is required.');
  if (!user.password) return console.error('\nPassword is required.');

  const hashedPassword = await hashPassword(user.password);
  updateUser({ username: user.username }, { passwordHash: hashedPassword });

  console.log('User is updated successfully.');
};

const user = getUser();
updateUserOnDB(user);
