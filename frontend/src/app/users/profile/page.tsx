'use client'
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import { fetcherGet } from '@/apicalls/index'
import {
  VStack,
  Heading,
  Center,
  Box,
  Text,
  HStack,
  Fade,
  Select
} from '@chakra-ui/react'
import StatComponent from '@/components/statComponent'
import useAuth from '@/providers/useAuth'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter
} from 'recharts'
import TypeCard from '@/components/typeCard'
import { getSlidingAverage } from '@/util/functions'

enum Amount {
  ALL = 'all',
  LAST_10 = 'last10',
  LAST_100 = 'last100'
}

interface ResponseData {
  wpmAverage: number
  highestWpm: number
  accuracyAverage: number
  wpmHistory: number[]
  lastRaces: any[]
}

const profile = () => {
  const { data, error, isLoading } = useSWR('users/profile', (url) =>
    fetcherGet<ResponseData>(url)
  )
  const { user } = useAuth()
  const [selectedGraph, setSelectedGraph] = useState(Amount.LAST_10)

  // TODO: use these variables to calculate averages and best wpm dynamically
  const [last10Races, last100Races] = useMemo(() => {
    const lastRaces = data?.data?.lastRaces
    if (!lastRaces) return [[], []]
    return [
      lastRaces.slice(0, Math.min(lastRaces.length, 10)),
      lastRaces.slice(0, Math.min(lastRaces.length, 100))
    ]
  }, [data?.data?.lastRaces])

  if (isLoading || !data || error) {
    return
  }
  const { wpmAverage, highestWpm, accuracyAverage, wpmHistory } = data.data

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
          {last10Races.length === 0 ? (
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
              <HStack justifyContent="space-between">
                <HStack>
                  <Box mr={6}>
                    <Heading> {user?.username}</Heading>
                    <Heading size="md" color="#8884d8" m={3}>
                      wpm history
                    </Heading>
                  </Box>
                  <StatComponent
                    title="Games Played"
                    content={wpmHistory.length}
                  />
                </HStack>
                <Select
                  variant="filled"
                  size="lg"
                  w={40}
                  onChange={(e) => setSelectedGraph(e.target.value as Amount)}
                >
                  <option value={Amount.LAST_10}>Last 10</option>
                  <option value={Amount.LAST_100}>Last 100</option>
                  <option value={Amount.ALL}>All</option>
                </Select>
              </HStack>
              <HStack>
                <Box w="full" h={360} mr={6}>
                  {selectedGraph === Amount.ALL ? (
                    <AllGraph wpmHistory={wpmHistory} />
                  ) : selectedGraph === Amount.LAST_100 ? (
                    <Last100Graph wpmHistory={wpmHistory} />
                  ) : (
                    <Last10Graph wpmHistory={wpmHistory} />
                  )}
                </Box>
                <Center>
                  <VStack pb={12} spacing={6} align="flex-start">
                    <StatComponent title="Average wpm " content={wpmAverage} />
                    <StatComponent title="Highest wpm" content={highestWpm} />
                    <StatComponent
                      title="Accuracy average"
                      content={accuracyAverage}
                    />
                  </VStack>
                </Center>
              </HStack>
              <Heading size="md" textDecoration="underline">
                {' '}
                Latest races:{' '}
              </Heading>
              <VStack spacing={3} overflow="auto" maxHeight={500} pr={3}>
                {last10Races.map((race: any, index) => {
                  const { participants, timeFromNow, quote } = race

                  return (
                    <Box
                      p={2}
                      borderRadius="5px"
                      border="1px solid gray"
                      width="100%"
                      key={timeFromNow + index}
                    >
                      <Heading size="sm">{timeFromNow}</Heading>
                      <HStack>
                        <Text as="b">Participants:</Text>
                        {(participants as string[]).map(
                          (participant: string, index) => (
                            <Text key={participant}>
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

interface GraphProps {
  wpmHistory: number[]
}

const Last10Graph = ({ wpmHistory }: GraphProps) => {
  const last10 = useMemo(
    () => wpmHistory.slice(0, Math.min(wpmHistory.length, 10)),
    [wpmHistory]
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={last10.map((wpm: number, index) => ({ wpm, index: index + 1 }))}
      >
        <XAxis dataKey="index" />
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
  )
}

const Last100Graph = ({ wpmHistory }: GraphProps) => {
  const latest100 = useMemo(
    () => wpmHistory.slice(0, Math.min(wpmHistory.length, 100)),
    [wpmHistory]
  )
  const slidingAverage = useMemo(
    () => getSlidingAverage(latest100, 10),
    [latest100]
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={latest100.map((wpm: number, i: number) => ({
          wpm,
          tenAverage: slidingAverage[i],
          index: i + 1
        }))}
      >
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Scatter dataKey="wpm" fill="#8884d8" />
        <Line
          dot={false}
          type="monotone"
          dataKey="tenAverage"
          stroke="#8884d8"
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const AllGraph = ({ wpmHistory }: GraphProps) => {
  const slidingAverage = useMemo(
    () => getSlidingAverage(wpmHistory, 100),
    [wpmHistory]
  )
  const slidingAverage2 = useMemo(
    () => getSlidingAverage(wpmHistory, 10),
    [wpmHistory]
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={wpmHistory.map((wpm: number, i: number) => ({
          wpm,
          hundredAverage: slidingAverage[i],
          tenAverage: slidingAverage2[i],
          index: i + 1
        }))}
      >
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Scatter dataKey="wpm" fill="#8884d8" />
        <Line
          dot={false}
          type="monotone"
          dataKey="hundredAverage"
          stroke="#8884d8"
          strokeWidth={3}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="tenAverage"
          stroke="#82ca9d60"
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default profile
