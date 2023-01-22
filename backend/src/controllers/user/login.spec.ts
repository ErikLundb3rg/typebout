/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaMock } from '../../../prisma/singleton'
import bcrypt from 'bcrypt'
import { login } from './index'
import {
  generateAccessToken,
  generateRefreshToken
} from '../../auth/util/verifyers'

describe('Login Controller', () => {
  let req: any = {}
  let res: any = {}
  let user: any = {}

  beforeEach(() => {
    req = {}
    res = {}
    user = {
      id: 1,
      username: 'username',
      password: 'password',
      createdAt: new Date()
    }
    res.cookie = jest.fn()
    ;(generateAccessToken as jest.Mock) = jest
      .fn()
      .mockReturnValue('accesstoken')
    ;(generateRefreshToken as jest.Mock) = jest.fn()
    prismaMock.users.findUnique.mockResolvedValue(user)
  })

  test('is successful with correct input', async () => {
    req.body = {
      username: 'username',
      password: 'password'
    }
    ;(bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true)

    expect(await login(req, res)).toMatchSnapshot({
      data: {
        user: {
          createdAt: expect.any(Date)
        }
      }
    })
  })

  test('is unsuccessful with faulty password', async () => {
    req.body = {
      username: 'username',
      password: 'wrong_password'
    }
    ;(bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false)

    expect(await login(req, res)).toMatchSnapshot()
  })

  test('is unsuccessful with non-existant username', async () => {
    req.body = {
      username: 'wrong_username',
      password: 'password'
    }
    ;(bcrypt.compare as jest.Mock) = jest.fn()

    expect(bcrypt.compare).toHaveBeenCalledTimes(0)

    expect(await login(req, res)).toMatchSnapshot()
  })
})
