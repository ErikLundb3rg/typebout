import users from './users'
import races from './races'
import { Application } from 'express'
import { asyncHandler, defaultErrorResponse } from '../middlewares/api-utils'

export const addRoutes = (app: Application): void => {
  app.get('/healthcheck', (req, res) => {
    res.status(200).send('Server is up and running')
  })
  app.use('/users', users)
  app.use('/races', races)
  app.use(
    asyncHandler(async (req, res) =>
      defaultErrorResponse({
        status: 404,
        message: `Unknown request method: ${req.method}: ${req.path}`
      })
    )
  )
}
