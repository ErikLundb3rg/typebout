import { TypeBoutSocket } from '../types'

const colors = ['green', 'purple', 'blue', 'black']

export class Games {
  private games: Map<number, Group>

  constructor() {
    this.games = new Map()
  }

  public addGroup = (group: Group, id: number) => {
    this.games.set(id, group)
  }

  public getGroup = (id: number) => this.games.get(id)
}

class Group {
  private games: PersonalGame[]

  constructor(users: TypeBoutSocket[]) {
    this.games = users.map(
      (user, index) => new PersonalGame(user, colors[index])
    )
  }
}

class PersonalGame {
  private correct: number = 0
  private mistakes: number = 0
  private startTime: number | null = null
  private user: TypeBoutSocket
  private color: string

  constructor(user: TypeBoutSocket, color: string) {
    this.user = user
    this.color = color
  }
}
