import {
  TypeBoutSocket,
  GameInformation,
  EndGameStats,
  MistakeProps
} from '../types'
import { getWPM, round } from '../../utils/calculations'
import { Quotes } from '@prisma/client'

const colors = ['green', 'purple', 'blue', 'black']
const RAW_WPM_LOOKBACK = 5

const splitStringIncludeSpaces = (str: string) => {
  const res: string[] = []
  let curr = []
  for (let i = 0; i < str.length; i++) {
    curr.push(str[i])
    if (str[i] === ' ' || i === str.length - 1) {
      res.push(curr.join(''))
      curr = []
    }
  }
  return res
}

class Games {
  private games: Map<string, Group>

  constructor() {
    this.games = new Map()
  }

  public addGroup = (group: Group, id: string) => {
    this.games.set(id, group)
  }

  public getGroup = (id: string) => this.games.get(id)
}

export class Group {
  public personalGames: PersonalGame[]
  public quote: Quotes
  public started = false
  public raceId?: number

  constructor(personalGames: PersonalGame[], quote: Quotes) {
    this.personalGames = personalGames
    this.quote = quote
    personalGames.forEach((personalGame) => (personalGame.group = this))
  }

  public static fromUsers(
    users: TypeBoutSocket[],
    quote: Quotes,
    finishedCallback: (personalGame: PersonalGame) => Promise<void>
  ) {
    const personalGames = users.map(
      (user, index) =>
        new PersonalGame(user, colors[index], quote, finishedCallback)
    )
    return new this(personalGames, quote)
  }

  public getUsersPersonalGame = (user: TypeBoutSocket) =>
    this.personalGames.find((personalGame) => personalGame.user === user)

  public getSockets = () =>
    this.personalGames.map((personalGame) => personalGame.user)

  public gameInformation = () =>
    this.personalGames.map((personalGame) => personalGame.getInformation())

  public endGameStats = () =>
    this.personalGames
      .filter((pg) => pg.hasFinished())
      .map((pg) => pg.endGameStats)
      .filter((egs): egs is EndGameStats => egs !== null)

  public allFinished = () =>
    this.personalGames.every((personalGame) => personalGame.hasFinished())

  public startGames = () => {
    if (this.started) {
      throw new Error('cant start game more than once')
    }
    this.started = true
    this.personalGames.forEach((personalGame) => personalGame.startGame())
  }
}

export class PersonalGame {
  // times are in milliseconds
  private startTime: number | null = null
  private endTime: number | null = null

  private color: string
  public user: TypeBoutSocket
  public group: Group | undefined

  private graphData: { wpm: number; rawWpm: number; time: number }[] = []
  private wordCompletionTimes: number[] = []
  private quote: Quotes
  private splitQuoteContent: string[]
  private currentWordIndex = 0
  private current: number = 0
  private mistakes: number = 0
  private mistakeWords: string[] = []
  public endGameStats: null | EndGameStats = null

  private finishedCallback: (personalGame: PersonalGame) => Promise<void>

  constructor(
    user: TypeBoutSocket,
    color: string,
    quote: Quotes,
    finishedCallback: (personalGame: PersonalGame) => Promise<void>
  ) {
    this.user = user
    this.color = color
    this.quote = quote
    this.splitQuoteContent = splitStringIncludeSpaces(quote.content)
    this.finishedCallback = finishedCallback
  }

  public startGame = () => {
    this.startTime = Date.now()
  }

  public hasFinished = () => this.endTime !== null

  private getWPM = () => {
    if (this.endTime !== null && this.startTime !== null) {
      const seconds = (this.endTime - this.startTime) / 1000
      return getWPM(this.current, seconds)
    }

    if (this.startTime !== null) {
      const seconds = (Date.now() - this.startTime) / 1000
      return getWPM(this.current, seconds)
    }
    return 0
  }

  // This information is sent during the game
  // to all users
  public getInformation = (): GameInformation => {
    return {
      wpm: this.getWPM(),
      user: {
        username: this.user.data.username || 'unknown',
        id: this.user.data.id!,
        isGuest: this.user.data.isGuest!
      },
      color: this.color,
      progressPercentage: Math.round(
        100 * (this.current / this.quote.content.length)
      )
    }
  }

  public setEndGameStats = () => {
    if (this.endTime === null || this.startTime === null) {
      throw new Error('Cannot retrieve end of game stats')
    }
    const { user, wpm } = this.getInformation()
    const { current, mistakes, mistakeWords, graphData } = this
    const correct = current - mistakes
    this.endGameStats = {
      user,
      wpm,
      time: round((this.endTime - this.startTime) / 1000, 1),
      accuracy: round(100 * (correct / current), 0),
      correct,
      mistakes,
      mistakeWords,
      placement: this.group!.personalGames.filter((personalGame) =>
        personalGame.hasFinished()
      ).length,
      graphData
    }
  }

  public setMistakes = (mistakesObj: MistakeProps) => {
    const { mistakeWords, mistakes } = mistakesObj
    this.mistakes = mistakes
    this.mistakeWords = mistakeWords
  }

  public receiveWord = (receivedWord: string) => {
    const currentWord = this.splitQuoteContent[this.currentWordIndex]

    if (receivedWord !== currentWord) {
      this.mistakes++

      // If we have not Already hade a mistake on this word,
      // add it to the list of mistaken words
      const lastMistakenWord = this.mistakeWords[this.mistakeWords.length - 1]
      if (lastMistakenWord !== currentWord) {
        this.mistakeWords.push(currentWord)
      }

      return false
    }

    this.currentWordIndex += 1
    this.current += currentWord.length
    const wpm = this.getWPM()
    const now = (Date.now() - this.startTime!) / 1000
    const averageRawWpm =
      this.wordCompletionTimes.length < RAW_WPM_LOOKBACK
        ? wpm
        : getWPM(
            this.splitQuoteContent
              .filter(
                (_word, i) =>
                  i <= this.currentWordIndex &&
                  i > this.currentWordIndex - RAW_WPM_LOOKBACK
              )
              .map((s) => s.length)
              .reduce((a, b) => a + b, 0),
            now -
              this.wordCompletionTimes[
                this.wordCompletionTimes.length - RAW_WPM_LOOKBACK
              ]
          )
    this.graphData.push({ wpm: wpm, rawWpm: averageRawWpm, time: now })
    this.wordCompletionTimes.push(now)

    const wasLastWord = this.currentWordIndex === this.splitQuoteContent.length
    if (wasLastWord) {
      this.endTime = Date.now()
      this.finishedCallback(this).catch((error) => console.error(error))
    }

    return true
  }
}

export default new Games()
