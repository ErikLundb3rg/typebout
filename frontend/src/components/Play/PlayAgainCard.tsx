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

interface PlayAgainCardProps {
  onClick: () => void
  color?: string
}

const ONE_SECOND = 1000

const getPrefix = (x: number) => (x < 10 ? '0' : '')

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return getPrefix(minutes) + minutes + ':' + getPrefix(seconds) + seconds
}

export const PlayAgainCard = ({
  onClick,
  color = 'persianGreen'
}: PropsWithChildren<PlayAgainCardProps>) => {
  return (
    <Card
      variant="filled"
      onClick={onClick}
      _hover={{
        cursor: 'pointer',
        background: useColorModeValue(`${color}.400`, `${color}.300`)
      }}
      background={useColorModeValue(`${color}.200`, `${color}.500`)}
      minW="200px"
    >
      <CardHeader>
        <Heading size="md">Play again</Heading>
      </CardHeader>
      <CardFooter>
        <Flex justifyContent="flex-end" w="100%">
          <ArrowRightIcon />
        </Flex>
      </CardFooter>
    </Card>
  )
}
