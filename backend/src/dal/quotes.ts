import db from '../../prisma/client'

export const getRandomQuote = async () => {
  const productsCount = await db.quotes.count()
  const skip = Math.floor(Math.random() * productsCount)

  const randomQuote = await db.quotes.findFirst({
    skip,
    include: {
      author: true
    }
  })

  if (!randomQuote) {
    throw new Error('No quotes in database')
  }

  return randomQuote
}
