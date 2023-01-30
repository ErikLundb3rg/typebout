import { TypeBoutSocket } from './types'
import { UserInformation } from './types'
// This should be something a bit more sophisticated after MVP
class RoomIDGenerator {
  private count: number

  constructor() {
    this.count = 0
  }

  getID = () => {
    const tmp = this.count
    this.count += 1
    return tmp
  }
}

class RoomDirector {
  private rooms: Map<number, Room>
  private roomIDGenerator: RoomIDGenerator

  constructor() {
    this.rooms = new Map()
    this.roomIDGenerator = new RoomIDGenerator()
  }

  createRoom = (user: TypeBoutSocket) => {
    const id = this.roomIDGenerator.getID()
    this.rooms.set(id, new Room(user))
    console.log(`Creating room with roomID: ${id}`)
    return id
  }

  getRoom = (roomId: number) => this.rooms.get(roomId)
}

export class Room {
  private users: TypeBoutSocket[]
  private admin: TypeBoutSocket

  constructor(user: TypeBoutSocket) {
    this.admin = user
    this.users = [user]
  }

  addUser = (user: TypeBoutSocket) => {
    this.users.push(user)
  }

  public getUsers = () => this.users

  getInformation = () =>
    this.users.map((user) => {
      const { isGuest, username } = user.data
      return {
        isGuest,
        username
      } as UserInformation
    })
}

export default new RoomDirector()
