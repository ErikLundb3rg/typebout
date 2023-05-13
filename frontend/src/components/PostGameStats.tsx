'use client'
import { EndGameStats } from '@/socket/types'
import {
  Heading,
  Stack,
  VStack,
  SimpleGrid,
  OrderedList,
  ListItem,
  HStack,
  Text
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
  const wpmHistoryTime = chosenEndgameStats.wpmHistory
  const wpmHistory = chosenEndgameStats.wpmHistory.map((wpm) => wpm.wpm)
  const rawWpmHistory = wpmHistoryTime.map(({ wpm, time }, i) => {
    const lookback = 2
    if (i < lookback) return wpm
    const words = wpm * time
    const earlierWpm = wpmHistory[i - lookback]
    const earlierWords = earlierWpm * wpmHistoryTime[i - lookback].time
    return (words - earlierWords) / (time - wpmHistoryTime[i - lookback].time)
  })

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
        <VStack w={['100%', '70%']} pr={[3, 0]}>
          <Heading as="h4" size="md" mb={4}>
            WPM History
          </Heading>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={wpmHistoryTime.map(({ wpm, time }, i) => ({
                wpm,
                rawWpm: rawWpmHistory[i].toFixed(0)
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis domain={['dataMin - 10', 'auto']} />
              <Tooltip />
              <CartesianGrid stroke="#70707010" />
              <Legend />
              <Line
                dot={false}
                type="monotone"
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
