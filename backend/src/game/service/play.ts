import { Group, PersonalGame } from '../logic/gameDirector'
import { sendEndGameStats, sendGameInfo } from '../emissions'
import { addPerformance } from '../../dal/performances'
import { getUserByUsername, registerUser } from '../../dal/user'
import fs from 'fs'
import { getWPM } from '../../utils/calculations'

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

  personalGame.setEndGameStats()
  // Send final users data to user
  sendEndGameStats(group)

  const { username } = personalGame.user.data
  if (personalGame.user.data.isGuest) {
    let user = await getUserByUsername(username!)
    const { correct, mistakes, time } = personalGame.endGameStats!

    if (!user) {
      user = await registerUser({
        username: personalGame.user.data.username!,
        password: 'dummy'
      })

      const { email, phone } = personalGame.user.data.user as any
      fs.appendFile(
        'users.csv',
        `\n${username},${email},${phone},${getWPM(correct + mistakes, time)}`,
        function (err) {
          if (err) throw err
          console.log('Saved!')
        }
      )
    }

    const { raceId } = await addPerformance({
      completed_in_ms: time * 1000,
      correct,
      mistakes,
      quoteId: group.quote.id,
      userId: user.id,
      raceId: group.raceId
    })

    if (!group.raceId) {
      group.raceId = raceId
    }
  }
}
