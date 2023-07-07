import { Inter } from "next/font/google"
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
  VStack,
  Collapse,
  Text
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
}: CountDownCardProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <Card
      variant="filled"
      background={useColorModeValue(`${color}.200`, `${color}.500`)}
      w="100%"
      p={0}
    >
      <CardHeader>
        <Heading p={0} size="md">
          Starting in {formatTime(count)}
        </Heading>
        {/* <Heading size="md">
            {count == 0
              ? allFinished
                ? `Finished`
                : `Go!`
              : `Get ready in: ${formatTime(count)} `}
          </Heading> */}
      </CardHeader>
      {/* <CardBody>
          <Heading size="2xl" visibility={count > 0 ? 'visible' : 'hidden'}>
            {formatTime(count)}
          </Heading>
        </CardBody> */}
    </Card>
  )
}
