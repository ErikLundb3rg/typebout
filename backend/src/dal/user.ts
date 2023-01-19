import db from '../../prisma/client'

interface UserDBProps {
  username: string
  password: string
}

export const registerUser = async ({ username, password }: UserDBProps) =>
  await db.users.create({
    data: {
      username,
      password
    }
  })

export const getUserByUsername = async (username: string) =>
  await db.users.findUnique({
    where: {
      username
    }
  })

export const getUserById = async (id: number) =>
  await db.users.findUnique({
    where: {
      id
    }
  })
