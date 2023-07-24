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
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { Spinner } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'
import { ArrowRightIcon } from '@chakra-ui/icons'

const inter = Inter({ subsets: ['latin'] })

interface TypeCardProps {
  header: string
  onClick: () => void
  color?: string
}

export const TypeButtonCard = ({
  onClick,
  color = 'persianGreen',
  header
}: PropsWithChildren<TypeCardProps>) => {
  const [loading, setLoading] = useState(false)

  return (
    <Card
      variant="filled"
      onClick={onClick}
      _hover={{
        cursor: 'pointer',
        background: useColorModeValue(`${color}.400`, `${color}.300`)
      }}
      background={useColorModeValue(`${color}.200`, `${color}.500`)}
      flex={1}
    >
      <CardHeader>
        <Heading size="md"> {header} </Heading>
      </CardHeader>
      <CardFooter>
        <Flex justifyContent="flex-end" w="100%">
          <ArrowRightIcon />
        </Flex>
      </CardFooter>
    </Card>
  )
}
