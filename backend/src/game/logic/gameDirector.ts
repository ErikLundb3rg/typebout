import { TypeBoutSocket, GameInformation, Quote } from '../types'

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
  private games: Map<number, Group>

  constructor() {
    this.games = new Map()
  }

  public addGroup = (group: Group, id: number) => {
    this.games.set(id, group)
  }

  public getGroup = (id: number) => this.games.get(id)
}

export class Group {
  public personalGames: PersonalGame[]
  public quote: Quote
  public started = false

  constructor(personalGames: PersonalGame[], quote: Quote) {
    this.personalGames = personalGames
    this.quote = quote
  }

  public static fromUsers(users: TypeBoutSocket[], quote: Quote) {
    const personalGames = users.map(
      (user, index) => new PersonalGame(user, colors[index], quote)
    )
    return new this(personalGames, quote)
  }

  public getUsersPersonalGame = (user: TypeBoutSocket) =>
    this.personalGames.find((personalGame) => personalGame.user === user)

  public getSockets = () =>
    this.personalGames.map((personalGame) => personalGame.user)

  public gameInformation = () =>
    this.personalGames.map((personalGame) => personalGame.getInformation())

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

  private quote: Quote
  private splitQuoteContent: string[]
  private currentWordIndex = 0
  private correct: number = 0
  private mistakes: number = 0
  private mistakenWords: string[] = []

  constructor(user: TypeBoutSocket, color: string, quote: Quote) {
    this.user = user
    this.color = color
    this.quote = quote
    this.splitQuoteContent = splitStringIncludeSpaces(quote.content)
  }

  public startGame = () => {
    this.startTime = Date.now()
  }

  public hasFinished = () => this.endTime !== null

  // This information is sent during the game
  // to all users
  public getInformation = (): GameInformation => {
    if (this.startTime == null) {
      throw new Error(
        'Can not get information of PersonalGame when there is no set Starttime'
      )
    }
    const deltaTime = Date.now() - this.startTime

    return {
      wpm: Math.round(this.correct / 5 / (deltaTime / 60000)),
      username: this.user.data.username || 'unknown',
      color: this.color
    }
  }

  public receiveWord = (receivedWord: string) => {
    const currentWord = this.splitQuoteContent[this.currentWordIndex]

    if (receivedWord !== currentWord) {
      this.mistakes++

      // If we have not Aalready hade a mistake on this word,
      // add it to the list of mistaken words
      const lastMistakenWord = this.mistakenWords[this.mistakenWords.length - 1]
      if (lastMistakenWord !== currentWord) {
        this.mistakenWords.push(currentWord)
      }

      return false
    }

    this.currentWordIndex += 1
    this.correct += currentWord.length

    const wasLastWord = this.currentWordIndex === this.splitQuoteContent.length
    if (wasLastWord) {
      this.endTime = Date.now()
    }

    return true
  }
}

export default new Games()