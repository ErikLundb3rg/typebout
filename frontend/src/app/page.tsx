'use client'
import { Inter } from '@next/font/google'
import useAuth from '@/providers/useAuth'
import { Stack, Heading, Center, Skeleton, Text } from '@chakra-ui/react'
import TypeCard from '@/components/typeCard'
import LatestPerformancesTable from '@/components/latestPerformancesTable'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <main>
      <Center>
        <Stack maxWidth="600px" align="center" spacing={6}>
          <Heading m="7" size="md" color="gray">
            Play against your friends to see who is the fastest...{' '}
          </Heading>
          <Stack direction={['column', 'row']}>
            <TypeCard header="Create game" path="game/createRoom">
              <Text>
                Create a game which gives you a link your friends can join
              </Text>
            </TypeCard>
            <TypeCard header="Join game" path="game/join">
              <Text>Join your friend's game through the room code</Text>
            </TypeCard>
          </Stack>
          <TypeCard header="Just released">
            <Text>
              Typebout was just released. This means you might find some bugs or
              other unintended things regarding the website.
            </Text>
          </TypeCard>
          <TypeCard header="Latest Races">
            <LatestPerformancesTable />
          </TypeCard>
        </Stack>
      </Center>
    </main>
  )
}
