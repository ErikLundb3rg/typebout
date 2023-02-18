'use client'
import { Inter } from '@next/font/google'
import useAuth from '@/providers/useAuth'
import {
  Grid,
  GridItem,
  Stack,
  Heading,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Button,
  SimpleGrid,
  Box,
  Center
} from '@chakra-ui/react'
import TypeCard from '@/components/typeCard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <main>
      <Center>
        <Stack maxWidth="600px" align="center">
          <Heading m="7" size="md" color="gray">
            Play against your friends to see who is the fastest...{' '}
          </Heading>
          <SimpleGrid columns={2}>
            <TypeCard
              header="Create game"
              content="Create a game which gives you a link your friends can join"
              path="game/createRoom"
            />
            <TypeCard
              header="Join game"
              content="Join your friend's game through the room code"
              path="game/join"
            />
          </SimpleGrid>
          <TypeCard
            header="Just released"
            content="Typebout was just released. This means you might find some bugs or other unintended things regarding the website. "
          />
          <TypeCard header="TBD" content="" path="/" />
        </Stack>
      </Center>
    </main>
  )
}
