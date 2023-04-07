'use client'
import { Inter } from '@next/font/google'
import {
  Box,
  Stack,
  Heading,
  Center,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import TypeCard from '@/components/typeCard'
import PerformancesTable from '@/components/performancesTable'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const textColor = useColorModeValue('gray', 'white')
  return (
    <main>
      <Center>
        <Stack maxWidth="600px" align="center" spacing={6}>
          <Heading m={8} size="md" color={textColor}>
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
              <br /> <br />
              Contact{' '}
              <a href="mailto:erik.lundberg32@gmail.com">
                erik.lundberg32@gmail.com
              </a>{' '}
              for inquiries.
            </Text>
          </TypeCard>
          <Stack direction={['column', 'row']}>
            <Box maxHeight={600} overflow="auto" boxShadow="lg">
              <TypeCard header="Latest Races">
                <PerformancesTable
                  path={'/races/getLatestPerformances?entries=10'}
                />
              </TypeCard>
            </Box>
            <Box maxHeight={600} overflow="auto" boxShadow="lg">
              <TypeCard header="Top races">
                <PerformancesTable path={'/races/topPerformances?entries=10'} />
              </TypeCard>
            </Box>
          </Stack>
        </Stack>
      </Center>
    </main>
  )
}
