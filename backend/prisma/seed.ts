import { PrismaClient } from '@prisma/client'
import quoteFile from '../quotes/quotes.json'

const prisma = new PrismaClient()

const main = async () => {
  // delete all quotes

  for (const quote of quoteFile) {
    await prisma.quotes.upsert({
      where: { content: quote.content },
      update: {},
      create: {
        content: quote.content,
        author: {
          connectOrCreate: {
            where: {
              name: quote.author
            },
            create: {
              name: quote.author
            }
          }
        }
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
