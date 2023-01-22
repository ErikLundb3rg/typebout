import { User, BaseResponse } from '@/types'
import redaxios from 'redaxios'

const url = process.env.BACKEND_URL || 'http://localhost:1337'

export const login = async (params: {
  username: string,
  password: string
}) => {
  const response = await redaxios.post<BaseResponse>(url + '/users/login', params) 

  return response
}