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

  createRoom = (socket: Socket) => {
    this.rooms.set(this.roomIDGenerator.getID(), new Room(socket))
  }

  addUser = (socket: Socket, roomID: number) => {
    const room = this.rooms.get(roomID)
    if (room) {
      room.addUser(socket)
    } else {
      console.log(`Room not found: ${socket.data.username}${roomID}, `)
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
