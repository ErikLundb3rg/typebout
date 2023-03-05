import {
  AsyncController,
  defaultErrorResponse,
  defaultHappyResponse
} from '../../middlewares/api-utils'
import { getLatestPerformances } from '../../dal/performances'
import { getWPM } from '../../utils/calculations'

const entries = 10

export const latestPerformances: AsyncController<{}> = async (req, res) => {
  const performancesRaw = await getLatestPerformances(entries)

  const performances = performancesRaw.map(
    ({ correct, mistakes, completed_in_ms, createdAt, user }) => {
      const total = correct + mistakes
      console.log(completed_in_ms)
      const wpm = getWPM(total, completed_in_ms / 1000)

      return {
        date: createdAt,
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
