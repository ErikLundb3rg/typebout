'use client'
import React, { useEffect, useMemo, useState } from 'react'
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
  Select,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  Card,
  useColorModeValue
} from '@chakra-ui/react'
import StatComponent from '@/components/RaceStat'
import useAuth from '@/providers/useAuth'
import RaceStat from '@/components/RaceStat'
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
import TypeCard from '@/components/TypeCard'
import { getSlidingAverage } from '@/util/functions'
import { ChevronDownIcon } from '@chakra-ui/icons'

enum Amount {
  ALL = 'All',
  LAST_10 = 'Last 10',
  LAST_100 = 'Last 100'
}

interface ResponseData {
  wpmAverage: number
  highestWpm: number
  accuracyAverage: number
  wpmHistory: number[]
  lastRaces: any[]
}

const Profile = ({
  params: { username }
}: {
  params: { username: string }
}) => {
  const { user } = useAuth()
  const { data, error, isLoading } = useSWR(
    `users/profile?username=${username}`,
    (url) => fetcherGet<ResponseData>(url)
  )

  const [selectedGraph, setSelectedGraph] = useState(Amount.LAST_10)
  const cardColor = useColorModeValue('typeboutGray.600', 'typeboutGray.50')

  const last10 = useMemo(() => {
    const lastRaces = data?.data?.lastRaces
    if (!lastRaces) return []
    return lastRaces.slice(0, Math.min(lastRaces.length, 10)).reverse()
  }, [data?.data?.lastRaces])

  const [last10Races, last100Races, allRaces] = useMemo(() => {
    const wpmHistory = data?.data?.wpmHistory
    if (!wpmHistory) return [[], [], []]
    return [
      wpmHistory
        .slice(0, Math.min(wpmHistory.length, 10))
        .reverse()
        .map((wpm) => +wpm.toFixed(2)),
      wpmHistory
        .slice(0, Math.min(wpmHistory.length, 100))
        .reverse()
        .map((wpm) => +wpm.toFixed(2)),
      wpmHistory.reverse().map((wpm) => +wpm.toFixed(2))
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

  if (!data || isLoading) {
    return (
      <Fade in>
        <Heading m="7">Fetching profile...</Heading>
      </Fade>
    )
  }

  if (error) {
    return (
      <Fade in>
        <Heading m="7">Could not fetch profile</Heading>
      </Fade>
    )
  }

  const { accuracyAverage, wpmHistory } = data.data

  return (
    <Center p={3}>
      <Card variant="filled" w="100%" maxW={1300} p={8} color={cardColor}>
        <VStack w="100%" spacing={6}>
          <Flex justifyContent="space-between" wrap="wrap" w="100%" gap={6} alignItems="flex-end">
            <Box>
              <Heading size="md">Stats for: </Heading>
              <Heading> {username} </Heading>
            </Box>
            <Menu>
              <Flex wrap="wrap" alignItems="baseline" gap={4}>
                <Heading size="md" color="#8884d8">
                  wpm history:{' '}
                </Heading>
                <Heading size="md" color="#8884d8">
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    fontSize="lg"
                    p={3}
                  >
                    {selectedGraph}
                  </MenuButton>
                </Heading>
              </Flex>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setSelectedGraph(Amount.LAST_10)
                  }}
                >
                  Last 10
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedGraph(Amount.LAST_100)
                  }}
                >
                  Last 100
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedGraph(Amount.ALL)
                  }}
                >
                  All
                </MenuItem>
              </MenuList>
            </Menu>
            <Box>
              <StatComponent title="Games Played" content={wpmHistory.length} />
            </Box>
          </Flex>
          <VStack w="full" mr={6} spacing={6}>
            <Box w="100%" h={450}>
              {selectedGraph === Amount.ALL ? (
                <AllGraph wpmHistory={allRaces} />
              ) : selectedGraph === Amount.LAST_100 ? (
                <Last100Graph wpmHistory={last100Races} />
              ) : (
                <Last10Graph wpmHistory={last10Races} />
              )}
            </Box>
          </VStack>
          <Flex
            w="100%"
            wrap="wrap"
            gap={6}
            justifyContent="space-evenly"
            alignContent="flex-start"
          >
            <Box w={200}>
              <StatComponent
                title="Average wpm"
                content={(selectedGraph === Amount.ALL
                  ? allAverage
                  : selectedGraph === Amount.LAST_100
                  ? last100Average
                  : last10Average
                ).toFixed(1)}
              />
            </Box>
            <Box w={200}>
              <StatComponent
                title="Highest wpm"
                content={
                  selectedGraph === Amount.ALL
                    ? allBest
                    : selectedGraph === Amount.LAST_100
                    ? last100Best
                    : last10Best
                }
              />
            </Box>
            <Box w={200}>
              <StatComponent
                title="Accuracy average"
                content={accuracyAverage}
              />
            </Box>
          </Flex>
        </VStack>
      </Card>
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
        data={wpmHistory.map((wpm: number, index) => ({
          wpm,
          index: index + 1
        }))}
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
    () => getSlidingAverage(wpmHistory, 10).map((n) => +n.toFixed(2)),
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
        <Scatter dataKey="wpm" fill="#9894e8" />
        <Line
          dot={false}
          type="monotone"
          dataKey="tenAverage"
          stroke="#82ca9d"
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const AllGraph = ({ wpmHistory }: GraphProps) => {
  const slidingAverage = useMemo(
    () => getSlidingAverage(wpmHistory, 100).map((n) => +n.toFixed(2)),
    [wpmHistory]
  )
  const slidingAverage2 = useMemo(
    () => getSlidingAverage(wpmHistory, 10).map((n) => +n.toFixed(2)),
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
        <Scatter dataKey="wpm" fill="#a8a4f8" />
        <Line
          dot={false}
          type="monotone"
          dataKey="tenAverage"
          stroke="#82ca9d"
          strokeWidth={3}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="hundredAverage"
          stroke="cyan"
          strokeWidth={3}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default Profile
