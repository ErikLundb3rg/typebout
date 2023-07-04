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

  const last10= useMemo(() => {
    const lastRaces = data?.data?.lastRaces
    if (!lastRaces) return []
    return lastRaces.slice(0, Math.min(lastRaces.length, 10)).reverse();
  }, [data?.data?.lastRaces])

  const [last10Races, last100Races, allRaces] = useMemo(() => {
    const wpmHistory = data?.data?.wpmHistory
    if (!wpmHistory) return [[], [], []]
    return [
      wpmHistory.slice(0, Math.min(wpmHistory.length, 10)).reverse(),
      wpmHistory.slice(0, Math.min(wpmHistory.length, 100)).reverse(),
      wpmHistory.reverse()
    ]
  }, [data?.data?.wpmHistory])

  const [last10Average, last100Average, allAverage] = useMemo(() => {
    const wpmHistory = data?.data?.wpmHistory
    if (!wpmHistory) return [0, 0, 0]
    return [
      last10Races.reduce((a, b) => a + b, 0) / last10Races.length,
      last100Races.reduce((a, b) => a + b, 0) / last100Races.length,
      allRaces.reduce((a, b) => a + b, 0) / allRaces.length
    ]
  }, [data?.data?.wpmHistory])

  const [last10Best, last100Best, allBest] = useMemo(() => {
    const wpmHistory = data?.data?.wpmHistory
    if (!wpmHistory) return [0, 0, 0]
    return [
      Math.max(...last10Races),
      Math.max(...last100Races),
      Math.max(...allRaces)
    ]
  }, [data?.data?.wpmHistory])

  if (isLoading || !data || error) {
    return
  }
  const { accuracyAverage, wpmHistory } = data.data

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
                    <AllGraph wpmHistory={allRaces} />
                  ) : selectedGraph === Amount.LAST_100 ? (
                    <Last100Graph wpmHistory={last100Races} />
                  ) : (
                    <Last10Graph wpmHistory={last10Races} />
                  )}
                </Box>
                <Center>
                  <VStack pb={12} spacing={6} align="flex-start">
                    <StatComponent title="Average wpm " content={(selectedGraph === Amount.ALL ? allAverage : selectedGraph === Amount.LAST_100 ? last100Average : last10Average).toFixed(1)} />
                    <StatComponent title="Highest wpm" content={selectedGraph === Amount.ALL ? allBest : selectedGraph === Amount.LAST_100 ? last100Best : last10Best} />
                    <StatComponent
                        title="Accuracy average"
                        // TODO: dynamically calculate accuracy average based on selected graph
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
                {last10.map((race: any, index) => {
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={wpmHistory.map((wpm: number, index) => ({ wpm, index: index + 1 }))}
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
  const slidingAverage = useMemo(
    () => getSlidingAverage(wpmHistory, 10),
    [wpmHistory]
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={wpmHistory.map((wpm: number, i: number) => ({
          wpm,
          tenAverage: slidingAverage[i],
          index: i + 1
        }))}
      >
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Scatter dataKey="wpm" fill="#8884d8c0" />
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
        <Scatter dataKey="wpm" fill="#8884d840" />
        <Line
          dot={false}
          type="monotone"
          dataKey="tenAverage"
          stroke="#8884d8"
          strokeWidth={3}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="hundredAverage"
          stroke="#82ca9d"
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default profile
