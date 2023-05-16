'use client'
import { EndGameStats } from '@/socket/types'
import {
  Heading,
  Stack,
  VStack,
  SimpleGrid,
  OrderedList,
  ListItem
} from '@chakra-ui/react'
import StatComponent from './statComponent'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

interface PostGameStatsProps {
  chosenEndgameStats: EndGameStats
}

export function PostGameStats(props: PostGameStatsProps) {
  const { chosenEndgameStats } = props
  const wpmHistory = chosenEndgameStats.graphData.map((data) => data.wpm)
  const rawWpmHistory = chosenEndgameStats.graphData.map((data) => data.rawWpm)
  const completionTimes = chosenEndgameStats.graphData.map((data) => data.time)

  const maxWpm = Math.max(...wpmHistory, ...rawWpmHistory)
  const minWpm = Math.min(...wpmHistory, ...rawWpmHistory)
  const timeTicks = Array.from(
    { length: Math.ceil(completionTimes[completionTimes.length - 1] / 5) - 1 },
    (_, i) => (i + 1) * 5
  )
  const wpmTicks = Array.from(
    { length: Math.ceil((maxWpm - minWpm) / 10) },
    (_, i) => (i + Math.floor(minWpm / 10)) * 10
  )

  return (
    <VStack spacing={10} w="100%">
      <Stack
        w="100%"
        direction={['column', 'row']}
        justify="center"
        spacing={[8, 20]}
      >
        <VStack spacing={4}>
          <SimpleGrid columns={[2]} spacing={8}>
            <StatComponent title="wpm" content={chosenEndgameStats.wpm} />
            <StatComponent
              title="Time"
              content={`${chosenEndgameStats.time}s`}
            />
            <StatComponent
              title="Accuracy"
              content={`${chosenEndgameStats.accuracy}%`}
            />
            <StatComponent
              title="Errors"
              content={chosenEndgameStats.mistakes}
            />
          </SimpleGrid>
        </VStack>
        {chosenEndgameStats.mistakeWords.length > 0 && (
          <VStack maxH={250} overflowY="scroll" pr={4}>
            {chosenEndgameStats.mistakeWords.length === 0 ? (
              <Heading> No mistakes </Heading>
            ) : (
              <Heading> Mistakes </Heading>
            )}
            <OrderedList>
              {chosenEndgameStats.mistakeWords.map((mistake) => (
                <ListItem> {mistake} </ListItem>
              ))}
            </OrderedList>
          </VStack>
        )}
      </Stack>
      {wpmHistory.length > 0 && (
        <VStack w={['100%', '80%']} pr={[3, 0]}>
          <Heading as="h4" size="md" mb={4}>
            WPM History
          </Heading>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chosenEndgameStats.graphData}>
              <XAxis
                dataKey="time"
                type="number"
                ticks={timeTicks}
                domain={[
                  completionTimes[0],
                  completionTimes[completionTimes.length - 1]
                ]}
              />
              <YAxis domain={[minWpm - 5, maxWpm]} ticks={wpmTicks} />
              <Tooltip />
              <CartesianGrid stroke="#70707010" />
              <Legend />
              <Line
                dot={false}
                type="basis"
                dataKey="rawWpm"
                stroke="#82ca9d60"
                strokeWidth={2}
              />
              <Line
                dot={false}
                type="monotone"
                dataKey="wpm"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </VStack>
      )}
    </VStack>
  )
}
