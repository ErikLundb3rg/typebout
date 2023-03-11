'use client'
import { useEffect, useRef, useState, PropsWithChildren } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Quote,
  TypeBoutSocket,
  GameInformation,
  EndGameStats,
  MistakeProps
} from '@/socket/types'
import {
  Heading,
  Center,
  Stack,
  Flex,
  Spacer,
  HStack,
  Text,
  Button,
  Box,
  Input,
  VStack,
  Progress,
  Container,
  Table,
  Tbody,
  Tr,
  Td,
  Fade,
  TableContainer,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  OrderedList,
  ListItem
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import GameText from '@/components/gameText'
import StatComponent from './statComponent'
// import {
// LineChart,
// Line,
// XAxis,
// YAxis,
// CartesianGrid,
// Tooltip,
// Legend,
// ResponsiveContainer
// } from 'recharts'

interface PlayGameProps {
  count: number
  quote: Quote
  gameStarted: boolean
  onCorrectWord: (word: string, mistakeWords?: MistakeProps) => void
  gameInfoArr: GameInformation[]
  endGameStats: EndGameStats[]
}

const splitStringIncludeSpaces = (str: string) => {
  const res: string[] = []
  let curr = []
  for (let i = 0; i < str.length; i++) {
    curr.push(str[i])
    if (str[i] === ' ' || i === str.length - 1) {
      res.push(curr.join(''))
      curr = []
    }
  }
  return res
}

interface GameInfoListProps {
  gameInfoField: keyof GameInformation
  gameInfoArr: GameInformation[]
  component: JSX.Element
}

const UserTable = ({
  gameInfoArr
}: {
  gameInfoArr: GameInfoListProps['gameInfoArr']
}) => {
  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Tbody>
          {gameInfoArr.map((gameInfo, index) => {
            const { color, username, wpm, progressPercentage } = gameInfo
            return (
              <Tr>
                <Td> {username} </Td>
                <Td width={['100px', '400px']}>
                  <Progress
                    size="xs"
                    value={progressPercentage}
                    colorScheme={color}
                  />
                </Td>
                <Td isNumeric>{wpm}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default function PlayGame({
  count,
  quote,
  gameStarted,
  onCorrectWord,
  gameInfoArr,
  endGameStats
}: PlayGameProps) {
  const splitContent = splitStringIncludeSpaces(quote.content)
  const [completedContent, setCompletedContent] = useState('')
  const [currentWord, setCurrentWord] = useState(splitContent[0])
  const [upComingContent, setUpComingContent] = useState(
    splitContent.filter((_, idx) => idx !== 0)
  )
  const [correctIndex, setCorrectIndex] = useState<number>(-1)
  const [wrongIndex, setWrongIndex] = useState<number>(-1)
  const [completed, setCompleted] = useState(false)
  const { user } = useAuth()
  const [chosenEndgameStats, setChosenEndgameStats] = useState<EndGameStats>()
  const [wpmHistories, setWpmHistories] = useState<Record<string, number[]>>({})

  let mistakes = useRef(0)
  let mistakeWords = useRef<string[]>([])

  useEffect(() => {
    if (!chosenEndgameStats) {
      setChosenEndgameStats(
        endGameStats.find((eg) => eg.username === user?.username)
      )
    }
  }, [endGameStats])

  useEffect(() => {
    gameInfoArr.forEach((gameInfo) => {
      const { wpm, username } = gameInfo
      if (
        endGameStats.find((eg) => eg.username === username) !== undefined ||
        wpm === 0
      ) {
        return
      }

      if (wpmHistories[username] === undefined) {
        setWpmHistories((wpmHistory) => ({
          ...wpmHistory,
          [username]: []
        }))
        return
      }

      setWpmHistories((wpmHistory) => ({
        ...wpmHistory,
        [username]: [...wpmHistories[username], wpm]
      }))
    })
  }, [gameInfoArr])

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (completed) return

    if (!gameStarted) {
      event.currentTarget.value = ''
    }

    const input = event.currentTarget.value

    let isFaulty = false
    let newCorrectIndex = -1
    let newWrongIndex = -1
    for (let i = 0; i < input.length; i++) {
      if (i >= currentWord.length) {
        return
      }
      const char = input[i]

      if (char === currentWord[i] && !isFaulty) {
        newCorrectIndex = i
      } else {
        isFaulty = true
        newWrongIndex = i
      }
    }

    if (newWrongIndex > wrongIndex) {
      mistakes.current++
      const latestMistakeWord =
        mistakeWords.current[mistakeWords.current.length - 1]
      if (currentWord !== latestMistakeWord) {
        mistakeWords.current.push(currentWord)
      }
    }

    if (newCorrectIndex === currentWord.length - 1) {
      // @ts-ignore
      document.getElementById('input-form')?.reset()
      const newCompletedContent = completedContent + currentWord
      setCompletedContent(newCompletedContent)
      setCurrentWord(upComingContent[0])

      const tmp = upComingContent
      tmp.shift()
      setUpComingContent(tmp)

      setCorrectIndex(-1)
      setWrongIndex(-1)

      const isFinished = newCompletedContent.length === quote.content.length
      if (isFinished) {
        setCompleted(true)
        onCorrectWord(input, {
          mistakes: mistakes.current,
          mistakeWords: mistakeWords.current
        })
        return
      }
      onCorrectWord(input)
    } else {
      setCorrectIndex(newCorrectIndex)
      setWrongIndex(newWrongIndex)
    }
  }

  return (
    <VStack spacing="6">
      <Heading size="md" color="gray">
        {count > 0 ? (
          <Text>Race starting in {count} seconds</Text>
        ) : (
          <Text>Race!</Text>
        )}
      </Heading>
      <UserTable gameInfoArr={gameInfoArr} />
      <Box p={3}>
        <GameText
          {...{
            completedContent,
            currentWord,
            upComingContent,
            correctIndex,
            wrongIndex
          }}
        />
        <Fade in>
          <Text size="md" visibility={completed ? 'visible' : 'hidden'} m={2}>
            - {quote.author}
          </Text>
        </Fade>
      </Box>
      <form id="input-form">
        <Input onChange={handleInputChange} />
      </form>
      {completed && chosenEndgameStats && (
        <Fade in>
          <VStack spacing="6">
            <HStack>
              <Text size="md"> Showing stats for: </Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {chosenEndgameStats.username}
                </MenuButton>
                <MenuList>
                  {endGameStats.map((endGameStat) => (
                    <MenuItem
                      onClick={() => setChosenEndgameStats(endGameStat)}
                    >
                      {endGameStat.username}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
            <Divider />

            <Stack direction={['column', 'row']} spacing={6}>
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
                <VStack>
                  <Heading> Mistakes </Heading>
                  <OrderedList>
                    {chosenEndgameStats.mistakeWords.map((mistake) => (
                      <ListItem> {mistake} </ListItem>
                    ))}
                  </OrderedList>
                </VStack>
              )}

              <Spacer />
              {/*wpmHistories[chosenEndgameStats.username].length > 0 && (
                <ResponsiveContainer width="95%" height={400}>
                  <LineChart
                    data={wpmHistories[chosenEndgameStats.username].map(
                      (wpm) => ({
                        wpm
                      })
                    )}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      dot={false}
                      type="monotone"
                      dataKey="wpm"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                    )*/}
            </Stack>
          </VStack>
        </Fade>
      )}
    </VStack>
  )
}
