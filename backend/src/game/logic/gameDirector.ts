import { TypeBoutSocket, GameInformation, Quote, EndGameStats } from '../types'

const colors = ['green', 'purple', 'blue', 'black']

const splitStringIncludeSpaces = (str: string) => {
  const res: string[] = []
  let curr = []
  for (let i = 0; i < str.length; i++) {
    curr.push(str[i])
    if (str[i] === ' ') {
      res.push(curr.join(''))
      curr = []
    }
  }
  if (curr.length > 0) {
    res.push(curr.join(''))
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
  public quote: Quote
  public started = false

  constructor(personalGames: PersonalGame[], quote: Quote) {
    this.personalGames = personalGames
    this.quote = quote
    personalGames.forEach((personalGame) => (personalGame.group = this))
  }

  public static fromUsers(
    users: TypeBoutSocket[],
    quote: Quote,
    finishedCallback: (personalGame: PersonalGame) => void
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
    this.personalGames.map((personalGame) => personalGame.getEndGameStats())

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

  private quote: Quote
  private splitQuoteContent: string[]
  private currentWordIndex = 0
  private correct: number = 0
  private mistakes: number = 0
  private mistakeWords: string[] = []

  private finishedCallback: (personalGame: PersonalGame) => void

  constructor(
    user: TypeBoutSocket,
    color: string,
    quote: Quote,
    finishedCallback: (personalGame: PersonalGame) => void
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
      return Math.round(
        this.correct / 5 / ((this.endTime - this.startTime) / 60000)
      )
    }

    if (this.startTime !== null) {
      return Math.round(
        this.correct / 5 / ((Date.now() - this.startTime) / 60000)
      )
    }
    return 0
  }

  // This information is sent during the game
  // to all users
  public getInformation = (): GameInformation => {
    return {
      wpm: this.getWPM(),
      username: this.user.data.username || 'unknown',
      color: this.color,
      progressPercentage: Math.round(
        (this.currentWordIndex / this.quote.content.length) * 100
      )
    }
  }

  public getEndGameStats = (): EndGameStats => {
    const { progressPercentage, username, wpm } = this.getInformation()
    const { correct, mistakes, mistakeWords } = this
    return {
      username,
      wpm,
      correct,
      mistakes,
      mistakeWords
    }
  }

  public receiveWord = (receivedWord: string) => {
    const currentWord = this.splitQuoteContent[this.currentWordIndex]

    if (receivedWord !== currentWord) {
      this.mistakes++

      // If we have not Aalready hade a mistake on this word,
      // add it to the list of mistaken words
      const lastMistakenWord = this.mistakeWords[this.mistakeWords.length - 1]
      if (lastMistakenWord !== currentWord) {
        this.mistakeWords.push(currentWord)
      }

      return false
    }

    this.currentWordIndex += 1
    this.correct += currentWord.length

    const wasLastWord = this.currentWordIndex === this.splitQuoteContent.length
    if (wasLastWord) {
      this.endTime = Date.now()
      this.finishedCallback(this)
    }

    return true
  }
}

export default new Games()
