import { TypeBoutSocket } from './types/game'
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
    return id
  }

  getRoom = (roomId: number) => this.rooms.get(roomId)
}

class Room {
  private users: TypeBoutSocket[]
  private admin: TypeBoutSocket

  constructor(user: TypeBoutSocket) {
    this.admin = user
    this.users = [user]
  }

  addUser = (user: TypeBoutSocket) => {
    this.users.push(user)
  }

  getInformation = () => this.users.map((user) => user.data)
}

export default new RoomDirector()
