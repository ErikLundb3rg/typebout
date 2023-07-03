'use client'
import { Inter } from '@next/font/google'
import {
  Box,
  Stack,
  Heading,
  Center,
  Skeleton,
  Text,
  useColorModeValue,
  Fade,
  Button,
  VStack,
  HStack,
  Flex
} from '@chakra-ui/react'
import TypeCard from '@/components/TypeCard'
import { PerformancesTable } from '@/components/PerformancesTable'

const inter = Inter({ subsets: ['latin'] })

const JoinGameCard = () => (
  <TypeCard
    header="Enter another lobby"
    path="game/join"
    buttonTitle="Join game"
  >
    <Text>Join your friend's game through the room code. </Text>
  </TypeCard>
)

const CreateGameCard = () => (
  <TypeCard
    header="Start a lobby with your friends"
    path="game/createRoom"
    buttonTitle="Create game"
  >
    <Text>
      Create a game which gives you a link your friends can join.
      <br />
    </Text>
  </TypeCard>
)

const InfoCard = () => (
  <TypeCard header="Just released">
    <Text>
      Typebout was just released. This means you might find some bugs or other
      unintended things regarding the website.
      <br /> <br />
      Contact{' '}
      <a href="mailto:erik.lundberg32@gmail.com">
        erik.lundberg32@gmail.com
      </a>{' '}
      for inquiries.
    </Text>
  </TypeCard>
)
export default function Home() {
  return (
    <main>
      <Center>
        <HStack
          justifyContent="center"
          p={[3]}
          flexWrap="wrap"
          width="100%"
          alignItems="flex-start"
          gap={2}
        >
          <VStack maxWidth={['none', '600px']} spacing={[2, 4]}>
            <Stack direction={['column', 'row']} spacing={[2, 4]}>
              <CreateGameCard />
              <JoinGameCard />
            </Stack>
            <InfoCard />
          </VStack>

          <Box m={3}>
            <PerformancesTable
              header="Latest Races"
              path={'/races/getLatestPerformances?entries=10'}
            />
          </Box>
          <Box m={3}>
            <PerformancesTable
              path={'/races/topPerformances?entries=10'}
              header="Top races"
            />
          </Box>
        </HStack>
      </Center>
    </main>
  )
}
