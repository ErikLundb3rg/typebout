import styles from '../page.module.css'
import { FormEvent } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Grid,
  GridItem,
  Stack,
  Heading,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Button,
  SimpleGrid,
  Box,
  Center,
  Input,
  VStack,
  StackDivider,
  Flex
} from '@chakra-ui/react'

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
    <Flex>
      <Text style={{ color: 'gray' }}>{completedContent}</Text>
      {completedContent && <Box>&nbsp;</Box>}
      <Flex>
        {currentWord?.split('').map((c, index) => {
          if (correctIndex >= index) {
            return (
              <Text key={index} style={{ color: 'green' }}>
                {c}
              </Text>
            )
          }

          if (wrongIndex >= index) {
            return (
              <Text key={index} style={{ color: 'red' }}>
                {c}
              </Text>
            )
          }

          return <Text key={index}> {c} </Text>
        })}
      </Flex>
      &nbsp;
      <Text>{upComingContent.join('')}</Text>
    </Flex>
  )
}

export default gameText
