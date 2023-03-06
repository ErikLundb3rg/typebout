import { Inter } from '@next/font/google'
import styles from './page.module.css'
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
  Progress,
  Flex
} from '@chakra-ui/react'
import Link from 'next/link'
import { Spinner } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface TypeCardProps {
  header: string
  path?: string
}

export default function TypeCard({
  header,
  path,
  children
}: PropsWithChildren<TypeCardProps>) {
  const [loading, setLoading] = useState(false)

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent="space-between">
          {path ? (
            <Link
              href={path}
              onClick={() => {
                setLoading(true)
              }}
            >
              <Heading
                size="md"
                textDecoration="underline"
                textDecorationColor="cyan"
                textDecorationThickness="2px"
              >
                {header}
              </Heading>
            </Link>
          ) : (
            <Heading size="md">{header}</Heading>
          )}
          {loading && <Spinner />}
        </Flex>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
