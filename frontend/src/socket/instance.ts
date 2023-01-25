import { keys } from "@/util/localstoragekeys";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from './types'



export const createSocket = () => {
  const token = localStorage.getItem(keys.accessToken)
  const user = localStorage.getItem(keys.user)
  const isGuest = localStorage.getItem(keys.isGuest)
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:1400", 
  {
    auth: {
      token,
      user: user ? JSON.parse(user) : null,
      isGuest: isGuest ? JSON.parse(isGuest) : null
    }
  })
  return socket
}
