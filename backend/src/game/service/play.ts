import { Group, PersonalGame } from '../logic/gameDirector'
import { sendEndGameStats, sendGameInfo } from '../emissions'
import { addPerformance } from '../../dal/performances'

export const sendGameInfoRepeatedly = (
  group: Group,
  intervalTimeMS: number,
  maxSeconds: number
) => {
  // Only allow for game to run for maxSeconds
  const maxSendTimes = maxSeconds / (intervalTimeMS / 1000)
  let times = 0

  const interval = setInterval(() => {
    sendGameInfo(group)
    times += 1
    if (group.allFinished() || times > maxSendTimes) {
      clearInterval(interval)
    }
  }, intervalTimeMS)
}

export const onFinish = async (personalGame: PersonalGame) => {
  const { group } = personalGame

  if (!group) {
    throw new Error('PersonalGame has no attached group')
  }
  sendGameInfo(group)
  // Send final users data to user
  sendEndGameStats(group)

  if (personalGame.user.data.isGuest) {
    return
  }

  // Log users result to database
  const personalGameFinalStats = personalGame.getEndGameStats()
  // time in seconds
  const { correct, mistakes, time } = personalGameFinalStats
  const { raceId } = await addPerformance({
    completed_in_ms: time * 1000,
    correct,
    mistakes,
    quoteId: group.quote.id,
    userId: personalGame.user.data.id!,
    raceId: group.raceId
  })
  if (!group.raceId) {
    group.raceId = raceId
  }
}
