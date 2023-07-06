import { Inter } from '@next/font/google'
import {
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Button,
  CardFooter
} from '@chakra-ui/react'
import Link from 'next/link'
import { Spinner } from '@chakra-ui/react'
import { PropsWithChildren, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface TypeCardProps {
  header?: string
  path?: string
  buttonTitle?: string
}

export default function TypeCard({
  header,
  path,
  buttonTitle,
  children
}: PropsWithChildren<TypeCardProps>) {
  const [loading, setLoading] = useState(false)

  return (
    <Card variant="filled">
      {header && (
        <CardHeader>
          <Heading size="md">{header}</Heading>
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {buttonTitle && (
        <CardFooter>
          <Link
            href={path || '/'}
            onClick={() => {
              setLoading(true)
            }}
          >
            <Button variant="solid" colorScheme="persianGreen">
              {buttonTitle}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
