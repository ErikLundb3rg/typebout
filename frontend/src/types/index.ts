export interface User {
    id:  number,
    username: string,
    password: string,
    createdAt: Date
}

export interface BaseResponse {
  message: string | null
  data: any 
  status: number
  ok: boolean
}

