import { Inter } from 'next/font/google'
import { Heading, Card, CardHeader, useColorModeValue } from '@chakra-ui/react'
import { use, useState } from 'react'

interface CountDownCardProps {
  count: number
  allFinished: boolean
  color?: string
}

const getPrefix = (x: number) => (x < 10 ? '0' : '')

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return getPrefix(minutes) + minutes + ':' + getPrefix(seconds) + seconds
}

export const CountDownCard = ({
  count,
  color = 'persianGreen'
}: CountDownCardProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <Card
      variant="filled"
      background={
        count !== 0
          ? useColorModeValue(`${color}.200`, `${color}.500`)
          : useColorModeValue(`persianGreen.200`, `persianGreen.500`)
      }
      w="100%"
      p={0}
    >
      <CardHeader>
        <Heading p={0} size="md">
          {count !== 0 ? "Starting in: " + formatTime(count) : "GO!"}
        </Heading>
      </CardHeader>
    </Card>
  )
}
