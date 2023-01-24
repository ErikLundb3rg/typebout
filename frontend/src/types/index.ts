export interface Player {
  username: string
}

export interface User extends Player {
    id:  number,
    password: string,
    createdAt: Date
}

export type Guest = Player


export interface BaseResponse {
  message: string | null
  data: any 
  status: number
  ok: boolean
}

