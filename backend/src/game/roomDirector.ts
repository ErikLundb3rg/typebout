import { Socket } from 'socket.io'

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

  createRoom = (user: Socket) => {
    const id = this.roomIDGenerator.getID()
    this.rooms.set(id, new Room(user))
    return id
  }

  addUser = (user: Socket, roomID: number) => {
    const room = this.rooms.get(roomID)
    if (room) {
      room.addUser(user)
    } else {
      console.log(`Room not found: ${user.data.username}${roomID}, `)
    }
  }
}

class Room {
  private users: Socket[]
  private admin: Socket

  constructor(admin: Socket) {
    this.admin = admin
    this.users = [admin]
  }

  addUser = (user: Socket) => {
    this.users.push(user)
  }
}

export default new RoomDirector()
