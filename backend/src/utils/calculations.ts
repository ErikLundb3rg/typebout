import { Users, Performances } from '@prisma/client'

export const getWPM = (letters: number, seconds: number) =>
  Math.round(letters / 6 / (seconds / 60))

export const getEnrichedPerformance = <T extends Performances>(
  performance: T
) => {
  const { correct, mistakes, completed_in_ms } = performance
  const total = correct + mistakes
  const wpm = getWPM(total, completed_in_ms / 1000)

  return {
    ...performance,
    total,
    wpm
  }
}

export const round = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
