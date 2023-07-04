import { Text, Box, Fade } from '@chakra-ui/react'
import { PropsWithChildren, useEffect, useState } from 'react'

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
  height: '100%'
}

interface CurrentWordProps {
  currentWord: string
  correctIndex: number
  wrongIndex: number
}

const CurrentWord: React.FC<CurrentWordProps> = ({
  currentWord,
  correctIndex,
  wrongIndex
}) => {
  const currentIndex = Math.max(correctIndex, wrongIndex)

  const renderWord = () => {
    const letters = currentWord.split('')

    return letters.map((letter, index) => {
      let color = undefined
      let customStyle = {}

      if (index === 0 && currentIndex === -1) {
        customStyle = {
          ...customStyle,
          borderLeft: '1px solid black',
          marginLeft: '-1px'
        }
      } else if (currentIndex === index) {
        customStyle = {
          ...customStyle,
          borderRight: '1px solid black',
          marginRight: '-1px'
        }
      }

      if (correctIndex >= index) {
        customStyle = { ...customStyle, color: 'green' }
      } else if (wrongIndex >= index) {
        // Space, show red underline instead of coloring
        if (letter === ' ') {
          customStyle = {
            ...customStyle,
            textDecoration: 'underline',
            textDecorationColor: 'red',
            textDecorationThickness: '3px'
          }
        }
        customStyle = { ...customStyle, color: 'red' }
      }

      return (
        <span
          key={index}
          style={{
            color,
            ...customStyle
          }}
        >
          {letter}
        </span>
      )
    })
  }

  return <span>{renderWord()}</span>
}

interface ErrorSpaceProps {
  withErrorSpace: boolean
}
const ErrorSpace = ({ withErrorSpace }: ErrorSpaceProps) => {
  if (withErrorSpace) {
    return (
      <span
        style={{
          textDecoration: 'underline',
          textDecorationColor: 'red',
          textDecorationThickness: '3px'
        }}
      >
        {' '}
      </span>
    )
  }

  return (
    <span
      style={{
        textDecoration: 'underline',
        textDecorationColor: 'blue',
        textDecorationThickness: '3px'
      }}
    >
      {' '}
    </span>
  )
}

export const GameText = ({
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
      <Box fontSize="larger" lineHeight={8} whiteSpace="pre-wrap">
        <span
          style={{
            color: 'gray'
          }}
        >
          {completedContent}
        </span>
        {currentWord && (
          <CurrentWord
            correctIndex={correctIndex}
            currentWord={currentWord}
            wrongIndex={wrongIndex}
          />
        )}

        <span>{upComingContent}</span>
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
