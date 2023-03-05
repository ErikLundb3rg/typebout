import styles from '../page.module.css'
import { FormEvent } from 'react'
import useAuth from '@/providers/useAuth'
import { Text, Box, Flex, HStack, Container } from '@chakra-ui/react'

interface GameTextProps {
  completedContent: string
  currentWord: string
  upComingContent: string[]
  correctIndex: number
  wrongIndex: number
}
const gameText = ({
  completedContent,
  currentWord,
  upComingContent,
  correctIndex,
  wrongIndex
}: GameTextProps) => {
  return (
    <Box>
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
  )
}

export default gameText
