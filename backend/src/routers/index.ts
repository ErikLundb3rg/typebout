import users from './users'
import { Application } from 'express'
import { asyncHandler, defaultErrorResponse } from '../middlewares/api-utils'

export const addRoutes = (app: Application): void => {
  app.use('/users', users)
  app.use(
    asyncHandler(async (req, res) =>
      defaultErrorResponse({
        status: 404,
        message: `Unknown request method: ${req.method}: ${req.path}`
      })
    )
  )
}
