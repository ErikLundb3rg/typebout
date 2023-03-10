import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getLatestPerformances } from '../../dal/performances'
import { getEnrichedPerformance, getWPM } from '../../utils/calculations'
import moment from 'moment'
import { errorCodes } from '../../constants/error-codes'

interface QueryProps {
  entries: string
}

export const latestPerformances: AsyncController<{}, QueryProps> = async (
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
  const performancesRaw = await getLatestPerformances(nrEntries)

  const performances = performancesRaw.map((performanceWithUser) => {
    const enrichedPerformance = getEnrichedPerformance(performanceWithUser)
    const { createdAt, wpm, user } = enrichedPerformance
    const diff = moment(createdAt).fromNow()

    return {
      timeFromNow: diff,
      wpm,
      username: user.username
    }
  })

  return defaultHappyResponse({
    data: {
      performances
    }
  })
}
