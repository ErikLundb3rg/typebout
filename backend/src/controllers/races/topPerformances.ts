import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getTopPerformances, nukeTopPerformances } from '../../dal/performances'
import moment from 'moment'
import { errorCodes } from '../../constants/error-codes'

interface QueryProps {
  entries: string
}

export const topPerformances: AsyncController<{}, QueryProps> = async (
  req,
  res
) => {
  const { entries } = req.query

  if (!entries) {
    return defaultErrorResponse({
      message: 'Please provide a valid number of performances to request',
      status: errorCodes.BAD_REQUEST
    })
  }

  const nrEntries = Number(req.query.entries)
  const performances = await getTopPerformances(nrEntries)

  const performanceResponse = performances.map(({ createdAt, wpm, user }) => {
    const diff = moment(createdAt).fromNow()

    return {
      timeFromNow: diff,
      wpm,
      username: user.username
    }
  })

  return defaultHappyResponse({
    data: {
      performances: performanceResponse
    }
  })
}
