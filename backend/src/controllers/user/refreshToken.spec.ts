/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshToken } from './index'
import { sendBaseResponse } from '../../middlewares/api-utils'
import { getUserById } from '../../dal/user'
import {
  generateAccessToken,
  generateRefreshToken
} from '../../auth/util/verifyers'

describe('RefreshToken Controller', () => {
  let req: any = {}
  let res: any = {}

  beforeEach(() => {
    req = {}
    res = {}
    res.cookie = jest.fn()
    ;(sendBaseResponse as jest.Mock) = jest.fn()
    ;(generateAccessToken as jest.Mock) = jest
      .fn()
      .mockReturnValue('accesstoken')
    ;(generateRefreshToken as jest.Mock) = jest.fn()
  })

  test('gives back refreshToken and accessToken', async () => {
    req = {
      user: {
        userId: 1232313131
      }
    }
    ;(getUserById as jest.Mock) = jest.fn()
    ;(getUserById as jest.Mock).mockReturnValue({
      id: 1,
      username: 'username'
    })

    const response = await refreshToken(req, res)

    expect(response).toMatchSnapshot({
      data: {
        accessToken: expect.any(String)
      }
    })
    expect(res.cookie).toHaveBeenCalled()
  })
})
