import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getLatestPerformances } from '../../dal/performances'
import { getWPM } from '../../utils/calculations'
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

  const performances = performancesRaw.map(
    ({ correct, mistakes, completed_in_ms, createdAt, user }) => {
      const total = correct + mistakes
      const wpm = getWPM(total, completed_in_ms / 1000)
      const diff = moment(createdAt).fromNow()

      return {
        timeFromNow: diff,
        wpm,
        username: user.username
      }
    }
  )

  return defaultHappyResponse({
    data: {
      performances
    }
  })
}
