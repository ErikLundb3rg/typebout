import { Inter } from '@next/font/google'
import {
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Button,
  CardFooter,
  useColorMode,
  useColorModeValue,
  Center,
  VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { Spinner } from '@chakra-ui/react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ArrowRightIcon } from '@chakra-ui/icons'

const inter = Inter({ subsets: ['latin'] })

interface CountDownCardProps {
  count: number
  allFinished: boolean
  color?: string
}

const ONE_SECOND = 1000

const getPrefix = (x: number) => (x < 10 ? '0' : '')

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return getPrefix(minutes) + minutes + ':' + getPrefix(seconds) + seconds
}

let interval: NodeJS.Timeout

export const CountDownCard = ({
  count,
  allFinished,
  color = 'persianGreen'
}: PropsWithChildren<CountDownCardProps>) => {
  const [loading, setLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (count != 0) return

    console.log('creating interval for countdown')
    interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, ONE_SECOND)
  }, [count])

  useEffect(() => {
    if (!allFinished) return

    clearInterval(interval)
  }, [allFinished])

  return (
    <Card
      variant="filled"
      background={useColorModeValue(`${color}.200`, `${color}.500`)}
      minW="200px"
    >
      <CardHeader>
        <Heading size="md">
          {count == 0 ? (allFinished ? `Finished` : `Go!`) : `Get ready in: `}
        </Heading>
      </CardHeader>
      <CardBody>
        <Heading size="2xl">
          {count > 0 ? formatTime(count) : formatTime(elapsedTime)}{' '}
        </Heading>
      </CardBody>
    </Card>
  )
}
