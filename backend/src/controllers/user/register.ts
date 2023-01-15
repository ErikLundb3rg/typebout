import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../api-utils';
import { registerUser, getUserByUsername } from '../../dal/user';
import bcrypt from 'bcrypt';

interface RegisterProps {
  username: string;
  password: string;
  confirmPassword: string;
}

const userExists = async (username: string) => {
  const user = await getUserByUsername(username);
  return user && true;
};

const verifyRegistration = ({
  username,
  password,
  confirmPassword
}: RegisterProps) => {
  const errors: { [Property in keyof RegisterProps]?: string } = {};

  if (username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }

  if (password.trim() === '') {
    errors.password = 'Password cannot be empty';
  } else if (password != confirmPassword) {
    errors.confirmPassword = 'Confirmed password must be same as password';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
};

export const register: AsyncController<RegisterProps> = async (req) => {
  const { ok, errors } = verifyRegistration(req.body);

  if (!ok) {
    return defaultErrorResponse({
      data: errors,
      status: 400
    });
  }

  const { username, password } = req.body;

  if (await userExists(username)) {
    return defaultErrorResponse({
      message: 'A user with this username already exists',
      status: 400
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await registerUser({
      username,
      password: hashedPassword
    });

    return defaultHappyResponse({
      data: user,
      message: 'User signup was successful'
    });
  } catch (error) {
    return defaultErrorResponse({
      message: 'Something went wrong',
      status: 400
    });
  }
};
