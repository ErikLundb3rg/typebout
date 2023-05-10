import db from '../../prisma/client'
import { getEnrichedPerformance, getWPM } from '../utils/calculations'
import { Races, Users } from '@prisma/client'

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
      completed_in_ms: Math.round(completed_in_ms),
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

export const getTopPerformances = async (entries: number) => {
  const allPerformances = await db.performances.findMany({
    include: {
      user: true
    }
  })

  // TODO: all this sorting and filtering should be done in the database
  const enrichedPerformances = allPerformances.map((performance) =>
    getEnrichedPerformance(performance)
  )

  enrichedPerformances.sort((a, b) => {
    return b.wpm - a.wpm
  })

  const uniqueUsers = new Set()
  const uniquePerformances = enrichedPerformances.filter((performance) => {
    if (uniqueUsers.has(performance.user.id)) {
      return false
    } else {
      uniqueUsers.add(performance.user.id)
      return true
    }
  })

  return uniquePerformances.slice(0, entries)
}

export const getLatestPerformancesForUser = async (
  userId: Users['id'],
  entries: number
) => {
  return await db.performances.findMany({
    take: entries,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      race: {
        include: {
          performances: {
            include: {
              user: true
            }
          },
          quote: {
            include: {
              author: true
            }
          }
        }
      }
    },
    where: {
      userId
    }
  })
}

//export const nukeTopPerformances = async () => {
//const allPerformances = await db.performances.findMany({
//include: {
//user: true
//}
//})

//const enrichedPerformances = allPerformances.map((performance) =>
//getEnrichedPerformance(performance)
//)

//enrichedPerformances.forEach(async (p) => {
//const id = p.id

//if (p.wpm > 120) {
//await db.performances.delete({
//where: {
//id
//}
//})
//}
//})
//}
