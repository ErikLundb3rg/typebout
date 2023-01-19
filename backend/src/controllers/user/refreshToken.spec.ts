/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshToken } from './index'

describe('RefreshToken Controller', () => {
  let req: any = {}
  let res: any = {}

  beforeEach(() => {
    req = {}
    res = {}
    res.cookie = jest.fn()
  })

  test('gives back refreshToken and accessToken', async () => {
    req = {
      user: {
        userId: 1232313131
      }
    }
    expect(refreshToken(req, res)).toMatchSnapshot({
      data: {
        accessToken: expect.any(String)
      }
    })
    expect(res.cookie).toHaveBeenCalled()
  })
})
