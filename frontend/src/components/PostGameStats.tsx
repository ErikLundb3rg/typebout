'use client'
import { EndGameStats, GameInformation } from '@/socket/types'
import {
  Heading,
  Stack,
  VStack,
  SimpleGrid,
  OrderedList,
  ListItem,
  Button,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react'
import StatComponent from './statComponent'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import useAuth from '@/providers/useAuth'
import { SingleGraph, MultiGraph } from './graphComponents'

interface PostGameStatsProps {
  endGameStats: EndGameStats[]
  gameInfoArr: GameInformation[]
}

export function PostGameStats({
  gameInfoArr,
  endGameStats
}: PostGameStatsProps) {
  const [chosenEndgameStats, setChosenEndgameStats] = useState<
    EndGameStats | undefined
  >()
  const [showSingleGraph, setShowSingleGraph] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!chosenEndgameStats) {
      setChosenEndgameStats(
        endGameStats.find((eg) => eg.username === user?.username)
      )
    }
  }, [endGameStats])

  if (!chosenEndgameStats) {
    return null
  }

  const wpmHistory = endGameStats
    .map((stat) => stat.graphData.map((data) => data.wpm))
    .flat()
  const singleWpmHistory = chosenEndgameStats.graphData.map((data) => data.wpm)
  const singleRawWpmHistory = chosenEndgameStats.graphData.map(
    (data) => data.rawWpm
  )
  const completionTimes = showSingleGraph
    ? chosenEndgameStats.graphData.map((data) => data.time)
    : endGameStats.map((stat) => stat.graphData.map((data) => data.time)).flat()

  const maxWpm = showSingleGraph
    ? Math.max(...singleWpmHistory, ...singleRawWpmHistory)
    : Math.max(...wpmHistory)
  const minWpm = showSingleGraph
    ? Math.min(...singleWpmHistory, ...singleRawWpmHistory)
    : Math.min(...wpmHistory)
  const timeTicks = Array.from(
    { length: Math.ceil(Math.max(...completionTimes) / 5) - 1 },
    (_, i) => (i + 1) * 5
  )
  const wpmTicks = Array.from(
    { length: Math.ceil((maxWpm - minWpm) / 10) },
    (_, i) => (i + Math.floor(minWpm / 10)) * 10
  )

  return (
    <>
      <HStack>
        <Text size="md"> Showing stats for: </Text>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={
              endGameStats.length > 1 ? <ChevronDownIcon /> : undefined
            }
          >
            {chosenEndgameStats.username}
          </MenuButton>
          {endGameStats.length > 1 && (
            <MenuList>
              {endGameStats.map((endGameStat) => (
                <MenuItem onClick={() => setChosenEndgameStats(endGameStat)}>
                  {endGameStat.username}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>
        {endGameStats.length > 1 && (
          <Button onClick={() => setShowSingleGraph(!showSingleGraph)}>
            {showSingleGraph ? 'Show all graph' : 'Show single graph'}
          </Button>
        )}
      </HStack>
      <Divider />
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
            {showSingleGraph ? (
              <SingleGraph
                chosenEndgameStats={chosenEndgameStats}
                timeTicks={timeTicks}
                wpmTicks={wpmTicks}
                minWpm={minWpm}
                maxWpm={maxWpm}
                completionTimes={completionTimes}
              />
            ) : (
              <MultiGraph
                endGameStats={endGameStats}
                gameInfoArr={gameInfoArr}
                timeTicks={timeTicks}
                wpmTicks={wpmTicks}
                minWpm={minWpm}
                maxWpm={maxWpm}
                completionTimes={completionTimes}
              />
            )}
          </VStack>
        )}
      </VStack>
    </>
  )
}
