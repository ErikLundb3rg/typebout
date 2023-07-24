import { Text, Box, Fade, useColorModeValue, Flex } from '@chakra-ui/react'
import { PropsWithChildren, useEffect, useState } from 'react'
import './gameText.css'

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
  const borderColor = useColorModeValue('black', 'white')

  const renderWord = () => {
    const letters = currentWord.split('')

    return letters.map((letter, index) => {
      let color = undefined
      let customStyle = {}
      if (correctIndex >= index) {
        customStyle = { ...customStyle, color: 'green'}
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
        <>
          <span
            key={index}
            style={{
              position: 'relative'
            }}
          >
            {currentIndex === index - 1 && (
              <span
                className="blink"
                style={{
                  display: 'inline-block',
                  height: '20px',
                  width: '1.5px',
                  borderRadius: '100px',
                  marginBottom: '-4px',
                  marginLeft: '-1.5px',
                  backgroundColor: borderColor
                }}
              />
            )}
            <span
              style={{
                color,
                ...customStyle
              }}
            >
              {letter}
            </span>
          </span>
        </>
      )
    })
  }

  return <span style={
    {
      display: 'inline-block',
      position: 'relative'
    }
  }>{renderWord()}</span>
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
      <Box
        lineHeight={8}
        whiteSpace="pre-wrap"
        letterSpacing="1px"
        fontFamily="mono"
      >
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
