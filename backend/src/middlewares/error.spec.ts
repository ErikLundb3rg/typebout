/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandlingMiddleWare } from './error'
import { sendBaseResponse } from './api-utils'
import { BaseError } from '../utils/error'
import { errorCodes } from '../utils/error-codes'

describe('Error handling middleware', () => {
  let req: any = {}
  let res: any = {}

  beforeEach(() => {
    req = {}
    res = {
      send: jest.fn(),
      status: jest.fn()
    }
    ;(sendBaseResponse as jest.Mock) = jest.fn()
  })

  test('should return a error response on Syntax', async () => {
    errorHandlingMiddleWare(new SyntaxError(), req, res)
    const response = (sendBaseResponse as jest.Mock).mock.calls[0][0]
    console.log('response', response)
    expect(response).toMatchSnapshot()
  })
  test('should return a error response on URI error', async () => {
    errorHandlingMiddleWare(new URIError(), req, res)
    const response = (sendBaseResponse as jest.Mock).mock.calls[0][0]
    expect(response).toMatchSnapshot()
  })
  test('should replace response with BaseError', async () => {
    errorHandlingMiddleWare(
      new BaseError(errorCodes.BAD_REQUEST, 'Custom message'),
      req,
      res
    )
    const response = (sendBaseResponse as jest.Mock).mock.calls[0][0]
    expect(response).toMatchSnapshot()
  })
})
