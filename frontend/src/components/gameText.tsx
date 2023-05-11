import { Text, Box, Fade } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'
import '../css/gameText.css'

interface GameTextProps {
  completedContent: string
  currentWord: string
  upComingContent: string[]
  correctIndex: number
  wrongIndex: number
  splitContent: string[]
  author: string
  completed: boolean
}

interface CurrentWordProps {
  correctIndex: number
  wrongIndex: number
  currentWord: string
}

const cursorStyling = {
  content: '""',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  animation: 'blink 1s ease-in-out infinite'
}

const WithCursor = ({
  children,
  index,
  currentIndex
}: PropsWithChildren<{
  index: number
  currentIndex: number
}>) => {
  return (
    <span style={{ position: 'relative' }}>
      {index === 0 && currentIndex === -1 && (
        <span
          style={{
            ...cursorStyling,
            borderLeft: '1px solid black',
            position: 'absolute'
          }}
        ></span>
      )}
      {children}

      {currentIndex === index && (
        <span
          style={{
            ...cursorStyling,
            borderRight: '1px solid black',
            position: 'absolute'
          }}
        ></span>
      )}
    </span>
  )
}

const CurrentWord = ({
  correctIndex,
  currentWord,
  wrongIndex
}: CurrentWordProps) => {
  const currentIndex = Math.max(correctIndex, wrongIndex)

  const word = currentWord?.split('').map((c, index) => {
    if (correctIndex >= index) {
      return (
        <WithCursor currentIndex={currentIndex} index={index}>
          <span
            style={{
              color: 'green'
            }}
          >
            {c}
          </span>
        </WithCursor>
      )
    }

    if (wrongIndex >= index) {
      const underlineError =
        currentWord[index] === ' '
          ? {
              textDecoration: 'underline',
              textDecorationColor: 'red',
              textDecorationThickness: '3px'
            }
          : {}
      return (
        <WithCursor currentIndex={currentIndex} index={index}>
          <span
            style={{
              color: 'red',
              ...underlineError
            }}
          >
            {c}
          </span>
        </WithCursor>
      )
    }
    return (
      <WithCursor currentIndex={currentIndex} index={index}>
        <span>{c}</span>
      </WithCursor>
    )
  })

  return <span>{word}</span>
}

const gameText = ({
  completedContent,
  currentWord,
  upComingContent,
  correctIndex,
  wrongIndex,
  author,
  completed
}: GameTextProps) => {
  return (
    <>
      <Box fontSize="larger" userSelect="none">
        <span style={{ color: 'gray' }}>{completedContent}</span>
        <CurrentWord
          correctIndex={correctIndex}
          wrongIndex={wrongIndex}
          currentWord={currentWord}
        />

        <span>{upComingContent.join('')}</span>
      </Box>
      <Fade in>
        <Text
          size="md"
          textAlign="right"
          visibility={completed ? 'visible' : 'hidden'}
          m={2}
        >
          - {author}
        </Text>
      </Fade>
    </>
  )
}

export default gameText
