'use client'
import { useEffect, useRef, useState } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Quote,
  GameInformation,
  EndGameStats,
  MistakeProps
} from '@/socket/types'
import {
  Heading,
  Center,
  Text,
  Button,
  Box,
  Input,
  VStack,
  Progress,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tag
} from '@chakra-ui/react'
import GameText from '@/components/gameText'
import { PostGameStats } from './PostGameStats'

interface PlayGameProps {
  count: number
  quote: Quote
  gameStarted: boolean
  onCorrectWord: (word: string, mistakeWords?: MistakeProps) => void
  gameInfoArr: GameInformation[]
  endGameStats: EndGameStats[]
  canRestartGame: boolean
  handlePlayAgain: () => void
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

interface UserTableProps {
  gameInfoArr: GameInformation[]
  endgameStats: EndGameStats[]
}

const UserTable = ({ gameInfoArr, endgameStats }: UserTableProps) => {
  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Tbody>
          {gameInfoArr.map((gameInfo, index) => {
            const { color, username, wpm, progressPercentage } = gameInfo
            return (
              <Tr key={index}>
                <Td> {username} </Td>
                <Td width={['100px', '400px']}>
                  <Progress
                    size="xs"
                    value={progressPercentage}
                    colorScheme={color}
                  />
                </Td>
                <Td isNumeric>{wpm} wpm</Td>
                <Td isNumeric>
                  <Tag>
                    {
                      endgameStats.find((eg) => eg.username === username)
                        ?.placement
                    }
                  </Tag>
                </Td>
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
  endGameStats,
  handlePlayAgain,
  canRestartGame
}: PlayGameProps) {
  // I don't get this part, splitContent is never changed so why is it a state?
  const [splitContent, setSplitContent] = useState<string[]>(
    splitStringIncludeSpaces(quote.content)
  )
  const [completedContent, setCompletedContent] = useState('')
  const [currentWord, setCurrentWord] = useState(splitContent[0])
  const [upComingContent, setUpComingContent] = useState(
    splitContent.filter((_, idx) => idx !== 0)
  )
  const [correctIndex, setCorrectIndex] = useState<number>(-1)
  const [wrongIndex, setWrongIndex] = useState<number>(-1)
  const [completed, setCompleted] = useState(false)
  const [wpmHistories, setWpmHistories] = useState<Record<string, number[]>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  let mistakes = useRef(0)
  let mistakeWords = useRef<string[]>([])

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

  useEffect(() => {
    gameStarted && inputRef.current?.focus()
  }, [gameStarted])

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
    <Center>
      <VStack spacing="6" w={['100%', 'container.lg']}>
        <Heading size="md" color="gray">
          {count > 0 ? (
            <Text>Race starting in {count} seconds</Text>
          ) : (
            <Text>Race!</Text>
          )}
        </Heading>
        <UserTable gameInfoArr={gameInfoArr} endgameStats={endGameStats} />
        <Box p={3}>
          <GameText
            completedContent={completedContent}
            currentWord={currentWord}
            upComingContent={upComingContent}
            correctIndex={correctIndex}
            wrongIndex={wrongIndex}
            splitContent={splitContent}
            completed={completed}
            author={quote.author}
          />
        </Box>
        {!completed && (
          <form
            id="input-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Input
              variant="flushed"
              onChange={handleInputChange}
              size="lg"
              disabled={!gameStarted}
              ref={inputRef}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        )}
        {completed && (
          <VStack spacing="6" w="100%">
            {canRestartGame && (
              <Button onClick={handlePlayAgain} colorScheme="teal">
                Play again
              </Button>
            )}
            <PostGameStats
              endGameStats={endGameStats}
              gameInfoArr={gameInfoArr}
            />
          </VStack>
        )}
      </VStack>
    </Center>
  )
}
