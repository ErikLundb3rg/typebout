/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaMock } from '../../../prisma/singleton';
import { register } from './index';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken
} from '../../auth/util/verifyers';

describe('Register Controller', () => {
  let req: any = {};
  let res: any = {};
  let user: any = {};

  beforeEach(() => {
    req = {};
    res = {};
    user = {
      id: 1,
      username: 'username',
      password: 'password',
      createdAt: new Date('2023')
    };
    (generateAccessToken as jest.Mock) = jest
      .fn()
      .mockReturnValue('accesstoken');
    (generateRefreshToken as jest.Mock) = jest.fn();
  });

  test('is successful with correct input', async () => {
    req.body = {
      username: 'username',
      password: 'password',
      confirmPassword: 'password'
    };
    prismaMock.users.findUnique.mockResolvedValue(null);
    prismaMock.users.create.mockResolvedValue(user);
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashed_password');

    expect(await register(req, res)).toMatchSnapshot();
  });

  test('is unsuccessful with empty input', async () => {
    req.body = {
      username: '',
      password: '',
      confirmPassword: ''
    };

    expect(await register(req, res)).toMatchSnapshot();
  });

  test('is unsuccessful with confirmedPassword not matching password', async () => {
    req.body = {
      username: 'username',
      password: 'password',
      confirmPassword: 'passwordDifferent'
    };

    expect(await register(req, res)).toMatchSnapshot();
  });

  test('unsuccessful with already existing user', async () => {
    req.body = {
      username: 'username',
      password: 'password',
      confirmPassword: 'password'
    };
    prismaMock.users.findUnique.mockResolvedValue(user);

    expect(await register(req, res)).toMatchSnapshot();
  });
});
