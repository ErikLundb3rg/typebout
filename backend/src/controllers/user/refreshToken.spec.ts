/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshToken } from './index'
import { sendBaseResponse } from '../../middlewares/api-utils'

describe('RefreshToken Controller', () => {
  let req: any = {}
  let res: any = {}

  beforeEach(() => {
    req = {}
    res = {}
    res.cookie = jest.fn()
    ;(sendBaseResponse as jest.Mock) = jest.fn()
  })

  test('gives back refreshToken and accessToken', async () => {
    req = {
      user: {
        userId: 1232313131
      }
    }
    refreshToken(req, res)
    const response = (sendBaseResponse as jest.Mock).mock.calls[0][0]
    expect(response).toMatchSnapshot({
      data: {
        accessToken: expect.any(String)
      }
    })
    expect(res.cookie).toHaveBeenCalled()
  })
})
