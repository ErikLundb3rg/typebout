import db from '../../prisma/client'

export const getRandomQuote = async () => {
  const res = await db.quotes.findMany({
    include: {
      author: true
    }
  })
  const randomIndex = Math.round(Math.random() * (res.length - 1))
  const quote = res[randomIndex]
  return quote
}
