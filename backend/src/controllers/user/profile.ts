import {
  AsyncController,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getLatestPerformancesForUser } from '../../dal/performances'
import { JWTPayload } from '../../auth/util/verifyers'
import { getEnrichedPerformance } from '../../utils/calculations'

const nrOfRaces = 10

// You're not supposed to do business
// logic in controllers! :D
export const profile: AsyncController = async (req, res) => {
  const { userId } = req.user as JWTPayload

  const dataRaw = await getLatestPerformancesForUser(userId, nrOfRaces)
  const data = dataRaw.map((performance) => getEnrichedPerformance(performance))
  const nrLatestPerformances = data.length

  const wpmHistory = data.map(({ wpm }) => wpm)

  const wpmAverage =
    Math.round(
      (wpmHistory.reduce((total, current) => total + current, 0) /
        nrLatestPerformances) *
        100
    ) / nrLatestPerformances

  const highestWpm = Math.max(...wpmHistory)

  const accuracyAverage =
    data
      .map(({ total, correct }) => correct / total)
      .reduce((total, current) => total + current, 0) / nrLatestPerformances

  const lastRaces = data.map((performance) => {
    const {
      race: { performances, quote }
    } = performance
    const participants = performances.map((p) => p.user.username).sort()

    return {
      participants,
      quote: quote
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
