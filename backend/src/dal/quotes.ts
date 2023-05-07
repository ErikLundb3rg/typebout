import db from '../../prisma/client'

export const getRandomQuote = async () => {
  const productsCount = await db.quotes.count()

  const randomQuote = await db.quotes.findFirst({
    skip: Math.floor(Math.random() * productsCount) - 1,
    include: {
      author: true
    }
  })

  if (!randomQuote) {
    throw new Error('No quotes in database')
  }

  return randomQuote
}
