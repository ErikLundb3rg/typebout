import db from '../../prisma/client'

interface AddPerformanceProps {
  correct: number
  mistakes: number
  completed_in_ms: number
  userId: number
  quoteId: number
  raceId?: number
}

export const addPerformance = async (performance: AddPerformanceProps) => {
  const { completed_in_ms, correct, mistakes, userId, raceId, quoteId } =
    performance
  // Prisma won't let me give an undefined type...
  const definedRaceId = raceId || -1

  const res = await db.performances.create({
    data: {
      completed_in_ms,
      correct,
      mistakes,
      user: {
        connect: {
          id: userId
        }
      },
      race: {
        connectOrCreate: {
          where: {
            id: definedRaceId
          },
          create: {
            quote: {
              connect: {
                id: quoteId
              }
            }
          }
        }
      }
    }
  })
  return res
}

export const getLatestPerformances = async (entries: number) => {
  return await db.performances.findMany({
    take: entries,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true
    }
  })
}
