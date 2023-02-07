import { TypeBoutSocket } from '@/socket/types'
import { Player } from '@/socket/types'
import { createSocket } from './createSocket'

let socket: TypeBoutSocket | null = null

export const setSocket = async (user: Player, isGuest: boolean) => {
  socket = await createSocket(user, isGuest)
  return socket
}

export const getSocket = () => socket
