import styles from '../page.module.css'
import { FormEvent } from 'react'
import useAuth from '@/providers/useAuth'
import { Text, Box, Flex, HStack, Container, Fade } from '@chakra-ui/react'

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
        <Text as="span" style={{ color: 'gray' }}>
          {completedContent}
        </Text>
        <span>
          {currentWord?.split('').map((c, index) => {
            if (correctIndex >= index) {
              return (
                <div
                  key={index}
                  style={{ color: 'green', display: 'inline-block' }}
                >
                  {c}
                </div>
              )
            }

            if (wrongIndex >= index) {
              return (
                <div
                  key={index}
                  style={{ color: 'red', display: 'inline-block' }}
                >
                  {c}
                </div>
              )
            }

            return (
              <div key={index} style={{ display: 'inline-block' }}>
                {c}
              </div>
            )
          })}
        </span>
        {upComingContent.length > 0 && '\u00A0'}
        <Text as="span">{upComingContent.join('')}</Text>
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
