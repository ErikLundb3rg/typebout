import { Request, Response } from 'express'
import { BaseResponse, sendBaseResponse } from './api-utils'
import { BaseError } from '../utils/error'
import { errorCodes } from '../constants/error-codes'

export const errorHandlingMiddleWare = (
  genericError: Error,
  req: Request,
  res: Response
) => {
  const response: BaseResponse = {
    data: null,
    ok: false,
    status: 500,
    message: 'Something went wrong'
  }

  const error = genericError as BaseError

  if (error instanceof SyntaxError || error instanceof URIError) {
    response.status = errorCodes.BAD_REQUEST
    response.message = 'Unprocessable request'
  } else if (error instanceof BaseError) {
    response.status = error.status
    response.message = error.message
  }

  if (process.env.MODE === 'dev') {
    console.error(error)
  }

  sendBaseResponse(response, res)
}
