'use client'
import { Inter } from 'next/font/google'
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
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { useEffect } from 'react'
import { keys } from '@/util/localstoragekeys'
import useAuth from '@/providers/useAuth'
import { Link } from '@chakra-ui/next-js'
import { TypeButtonCard } from '@/components/TypeButtonCard'

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
    <Text>Create a game which gives you a link your friends can join.</Text>
  </TypeCard>
)

const InfoCard = () => (
  <TypeCard header="Just released">
    <Text>
      Typebout was just released. This means you might find some bugs or other
      unintended things regarding the website.
      {/* <br /> <br />
      Contact{' '}
      <a href="mailto:erik.lundberg32@gmail.com">
        erik.lundberg32@gmail.com
      </a>{' '}
      for inquiries. */}
    </Text>
  </TypeCard>
)
export default function Home() {
  const { logout } = useAuth()
  useEffect(() => {
    // Wipe each time you go to starting page because then we want a new guest when they
    // decide to create a game
    logout()
  }, [])
  return (
    <main>
      <GoogleAnalytics trackPageViews />
      <Center>
        <VStack>
          <Link href={'game/createRoom'} w="60%">
            <TypeButtonCard header="Start game" onClick={() => {}} />
          </Link>
          <Flex p={3} wrap="wrap" width="100%" gap={3} justifyContent="center">
            <Stack gap={3} direction={['column', 'row']}>
              <Flex flex={1} maxWidth="100%">
                <PerformancesTable
                  header="Latest Races"
                  path={'/races/getLatestPerformances?entries=10'}
                />
              </Flex>
              <Flex flex={1} maxW="100%">
                <PerformancesTable
                  path={'/races/topPerformances?entries=10'}
                  header="Top races"
                />
              </Flex>
            </Stack>
          </Flex>
        </VStack>
      </Center>
    </main>
  )
}
