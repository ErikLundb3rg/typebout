'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcherGet } from '@/apicalls/index'
import {
  VStack,
  Heading,
  Center,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Fade
} from '@chakra-ui/react'
import StatComponent from '@/components/statComponent'
import useAuth from '@/providers/useAuth'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import TypeCard from '@/components/typeCard'

const profile = () => {
  const { data, error, isLoading } = useSWR('users/profile', fetcherGet)
  const { user } = useAuth()

  if (error) {
    return <div></div>
  }

  if (isLoading || !data) {
    return <div></div>
  }

  const {
    data: { wpmAverage, highestWpm, accuracyAverage, wpmHistory, lastRaces }
  } = data

  return (
    <Center>
      <Fade in>
        <VStack
          w={['100%', 'container.lg']}
          justifyContent="center"
          spacing={2}
          align="left"
          direction={['column', 'row']}
        >
          {lastRaces.length === 0 ? (
            <VStack spacing={8}>
              <Box w={['80%', '30%']}>
                <Heading size="md">No stats available for</Heading>
                <Heading> {user?.username}</Heading>
              </Box>
              <TypeCard header="Play your first game" path="game/createRoom">
                <Text>
                  Create a game which gives you a link your friends can join
                </Text>
              </TypeCard>
            </VStack>
          ) : (
            <>
              <SimpleGrid columns={[1, 2]} spacing={6}>
                <VStack>
                  <Box>
                    <Heading size="md">Stats for</Heading>
                    <Heading> {user?.username}</Heading>
                  </Box>

                  <Heading size="md" color="#8884d8" m={3}>
                    wpm history
                  </Heading>

                  <Box w="100%" pr={[3, 0]}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={wpmHistory.map((wpm: number) => ({ wpm }))}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          dot={false}
                          type="monotone"
                          dataKey="wpm"
                          stroke="#8884d8"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </VStack>
                <Center>
                  <VStack spacing={6} align="flex-start">
                    <StatComponent title="Average wpm " content={wpmAverage} />
                    <StatComponent title="Highest wpm" content={highestWpm} />
                    <StatComponent
                      title="Accuracy average"
                      content={accuracyAverage}
                    />
                  </VStack>
                </Center>
              </SimpleGrid>
              <Heading size="md" textDecoration="underline">
                {' '}
                Latest races:{' '}
              </Heading>
              <VStack spacing={3} overflow="auto" maxHeight={500} pr={3}>
                {lastRaces.map((race: any) => {
                  const { participants, timeFromNow, quote } = race

                  return (
                    <Box
                      p={2}
                      borderRadius="5px"
                      border="1px solid gray"
                      width="100%"
                    >
                      <Heading size="sm">{timeFromNow}</Heading>
                      <HStack>
                        <Text as="b">Participants:</Text>
                        {(participants as string[]).map(
                          (participant: string, index) => (
                            <Text>
                              {participant}
                              {index !== participant.length - 1 ? ',' : ''}
                            </Text>
                          )
                        )}
                      </HStack>
                      <HStack>
                        <Text as="b">Quote:</Text>
                        <Text as="i" isTruncated maxWidth={'80%'}>
                          {quote.content}
                        </Text>
                        <Text noOfLines={1}> - {quote.author.name} </Text>
                      </HStack>
                    </Box>
                  )
                })}
              </VStack>
            </>
          )}
        </VStack>
      </Fade>
    </Center>
  )
}
export default profile
