import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getLatestPerformancesForUser } from '../../dal/performances'
import { JWTPayload } from '../../auth/util/verifyers'
import moment from 'moment'
import { getEnrichedPerformance } from '../../utils/calculations'
import { round } from '../../utils/calculations'
import { getUserByUsername } from '../../dal/user'
import { errorCodes } from '../../constants/error-codes'

interface QueryProps {
  username: string
}

export const profile: AsyncController<{}, QueryProps> = async (req) => {
  console.log('Received username: ', req.query.username)
  const user = await getUserByUsername(req.query.username)

  if (!user) {
    return defaultErrorResponse({
      message: 'User with given username not found',
      status: errorCodes.BAD_REQUEST
    })
  }

  const { id } = user

  const dataRaw = await getLatestPerformancesForUser(id)
  const data = dataRaw.map((performance) => getEnrichedPerformance(performance))
  const nrLatestPerformances = data.length

  const wpmHistory = data.map(({ wpm }) => wpm)

  const wpmAverage = Math.round(
    wpmHistory.reduce((total, current) => total + current, 0) /
      nrLatestPerformances
  )

  const highestWpm = Math.max(...wpmHistory)

  const accuracyAverage = round(
    data
      .map(({ total, correct }) => correct / total)
      .reduce((total, current) => total + current, 0) / nrLatestPerformances,
    2
  )

  const lastRaces = data.map((performance) => {
    const {
      race: { performances, quote, createdAt }
    } = performance
    const participants = performances.map((p) => p.user.username).sort()
    const timeFromNow = moment(createdAt).fromNow()

    return {
      participants,
      quote: quote,
      timeFromNow
    }
  })

  return defaultHappyResponse({
    data: {
      wpmAverage,
      highestWpm,
      accuracyAverage,
      wpmHistory,
      lastRaces
    }
  })
}
