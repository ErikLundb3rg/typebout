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
  Text,
  Box,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Center,
  useColorModeValue
} from '@chakra-ui/react'
import RaceStat from '../RaceStat'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import useAuth from '@/providers/useAuth'
import { SingleGraph, MultiGraph } from './GraphComponents'

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
  const [showSingleGraph, setShowSingleGraph] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!chosenEndgameStats) {
      setChosenEndgameStats(endGameStats.find((eg) => eg.user.id === user?.id))
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
    <Card variant="filled" w="100%">
      <CardHeader pb={0}>
        <VStack spacing={4} align="normal">
          <Box pl={3}>
            <Menu>
              <Heading size="md">Stats for: </Heading>
              <Heading>
                <MenuButton
                  as={Button}
                  rightIcon={
                    endGameStats.length > 1 ? <ChevronDownIcon /> : undefined
                  }
                  variant="ghost"
                  fontSize="3xl"
                  pl={0}
                >
                  {chosenEndgameStats.user.username}
                </MenuButton>
              </Heading>
              {endGameStats.length > 1 && (
                <MenuList>
                  {endGameStats
                    .filter(
                      (endGameStat) =>
                        endGameStat.user.id !== chosenEndgameStats.user.id
                    )
                    .map((endGameStat) => (
                      <MenuItem
                        onClick={() => setChosenEndgameStats(endGameStat)}
                      >
                        {endGameStat.user.username}
                      </MenuItem>
                    ))}
                </MenuList>
              )}
            </Menu>
          </Box>
        </VStack>
      </CardHeader>
      <CardBody
        color={useColorModeValue('typeboutGray.600', 'typeboutGray.50')}
      >
        <VStack spacing={10}>
          <Flex justifyContent="space-around" w="100%" wrap="wrap" gap={6}>
            <Box>
              <RaceStat title="wpm" content={chosenEndgameStats.wpm} />
            </Box>
            <Box>
              <RaceStat title="Time" content={`${chosenEndgameStats.time}s`} />
            </Box>
            <Box>
              <RaceStat
                title="Accuracy"
                content={`${chosenEndgameStats.accuracy}%`}
              />
            </Box>
            <Box>
              <RaceStat title="Errors" content={chosenEndgameStats.mistakes} />
            </Box>
          </Flex>
          <Flex wrap="wrap" w="100%" justifyContent="space-evenly" gap={6}>
            {wpmHistory.length > 0 && (
              <Box width={['100%', '70%']}>
                <VStack>
                  <Heading size="md">
                    wpm history{' '}
                    {endGameStats.length > 1 && (
                      <Button
                        onClick={() => setShowSingleGraph(!showSingleGraph)}
                        variant="solid"
                      >
                        {showSingleGraph ? 'Personal' : 'Everyone'}
                      </Button>
                    )}
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
              </Box>
            )}
            {chosenEndgameStats.mistakeWords.length > 0 && (
              <VStack maxHeight={300}>
                <Heading size="md">Mistakes</Heading>
                <Box overflowY="auto" pr={4}>
                  <OrderedList>
                    {chosenEndgameStats.mistakeWords.map((mistake, index) => (
                      <ListItem key={index}> {mistake} </ListItem>
                    ))}
                  </OrderedList>
                </Box>
              </VStack>
            )}
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  )
}
