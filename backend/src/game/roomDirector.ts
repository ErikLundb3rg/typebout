import { Socket } from 'socket.io'
import { TypeBoutSocket } from './types'
import { UserInformation } from './types'

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
    this.rooms.set(id, new Room(user, id))
    console.log(`Creating room with roomID: ${id}`)
    return id
  }

  getRoom = (roomId: number) => this.rooms.get(roomId)
}

export class Room {
  private users: TypeBoutSocket[] = []
  // We only allow the admin to emit a start game event
  private admin: TypeBoutSocket
  private id: number

  constructor(user: TypeBoutSocket, id: number) {
    this.admin = user
    this.id = id
    this.addUser(user)
  }

  addUser = (user: TypeBoutSocket) => {
    this.users.push(user)
    user.data.roomID = this.id
  }

  public getUsers = () => this.users

  public removeUser = (user: TypeBoutSocket) => {
    this.users = this.users.filter((current) => current !== user)
  }

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
