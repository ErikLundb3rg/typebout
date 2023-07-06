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
  Tag,
  Flex,
  Fade,
  SlideFade,
  HStack
} from '@chakra-ui/react'
import { GameText } from './GameText'
import { PostGameStats } from './PostGameStats'
import { UserTable } from './UserTable'
import TypeCard from '../TypeCard'
import { TypeButtonCard } from '../TypeButtonCard'
import { CountDownCard } from './CountDownCard'
import { PlayAgainCard } from './PlayAgainCard'

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
      <VStack p={3} w="100%" spacing={3} mb={300}>
        <VStack maxW={800} w={[null, 800]} spacing={3}>
          <UserTable gameInfoArr={gameInfoArr} endgameStats={endGameStats} />

          <Flex w="100%" gap={3} wrap="wrap">
            <Box w={['100%', '50%']}>
              <CountDownCard
                count={count}
                color="saffron"
                allFinished={canRestartGame}
              />
            </Box>
            <Box flexGrow={1}>
              <PlayAgainCard
                onClick={handlePlayAgain}
                canRestartGame={canRestartGame}
              ></PlayAgainCard>
            </Box>
          </Flex>
          <Box fontSize="larger" w="100%">
            <TypeCard header="Quote">
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
              <Box maxW={300}>
                <form
                  id="input-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Input
                    variant="flushed"
                    placeholder="Type here when the game begins"
                    onChange={handleInputChange}
                    size="lg"
                    disabled={!gameStarted || completed}
                    ref={inputRef}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </form>
              </Box>
            </TypeCard>
          </Box>
        </VStack>
        <Box maxW={1100} w="100%">
          <PostGameStats
            endGameStats={endGameStats}
            gameInfoArr={gameInfoArr}
          />
        </Box>
      </VStack>
    </Center>
  )
}
