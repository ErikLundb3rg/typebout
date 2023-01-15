/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaMock } from '../../../prisma/singleton';
import bcrypt from 'bcrypt';
import { login } from './index';
import {
  generateAccessToken,
  generateRefreshToken
} from '../../auth/util/verifyers';

describe('Users', () => {
  const req: any = {};
  const res: any = {};

  test('login should find user', async () => {
    const user = {
      id: 1,
      username: 'username',
      password: 'password',
      createdAt: new Date()
    };

    prismaMock.users.findUnique.mockResolvedValue(user);
    req.body = {
      username: 'username',
      password: 'password'
    };
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

    res.cookie = jest.fn();

    jest.mock('../../auth/util/verifyers');

    (generateAccessToken as jest.Mock) = jest
      .fn()
      .mockReturnValue('accesstoken');
    (generateRefreshToken as jest.Mock) = jest.fn();

    await expect(login(req, res)).resolves.toEqual({
      data: {
        accessToken: 'accesstoken'
      },
      message: 'Successful Login',
      ok: true,
      status: 200
    });
  });
});
