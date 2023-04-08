import { Inter } from '@next/font/google'
import { Heading, Card, CardHeader, CardBody, Flex } from '@chakra-ui/react'
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
    <>
      {path ? (
        <Link
          href={path}
          onClick={() => {
            setLoading(true)
          }}
        >
          <Card>
            <CardHeader>
              <Flex justifyContent="space-between">
                <Heading
                  size="md"
                  textDecoration="underline"
                  textDecorationColor="cyan"
                  textDecorationThickness="2px"
                >
                  {header}
                </Heading>
                {loading && <Spinner />}
              </Flex>
            </CardHeader>
            <CardBody>{children}</CardBody>
          </Card>
        </Link>
      ) : (
        <Card>
          <CardHeader>
            <Flex justifyContent="space-between">
              <Heading size="md">{header}</Heading>
              {loading && <Spinner />}
            </Flex>
          </CardHeader>
          <CardBody>{children}</CardBody>
        </Card>
      )}
    </>
  )
}
