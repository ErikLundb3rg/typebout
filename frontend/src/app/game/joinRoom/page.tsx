'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocketGameComponent, {
  BeforeGameComponentProps
} from '../socketGameComponentWrapper'
import {
  Heading,
  HStack,
  Text,
  Button,
  Box,
  Input,
  VStack,
  useClipboard,
  Tag,
  Spinner,
  ListItem,
  UnorderedList,
  Flex,
  Divider,
  Center
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

const JoinRoom = ({ players, socket, user }: BeforeGameComponentProps) => {
  const searchParams = useSearchParams()
  const roomID = searchParams.get('room')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  let body: any = null

  useEffect(() => {
    if (!user) return

    if (!roomID) {
      setError(true)
      return
    }

    socket.emit('joinRoom', roomID, (successful) => {
      if (!successful) {
        setError(true)
      }
      setLoading(false)
    })
  }, [user])

  if (error) {
    body = (
      <VStack spacing="3">
        <Heading size="md"> Could not find room </Heading>
        <Text>
          {' '}
          Are you sure you entered the correct roomID?{' '}
          <Link
            href="/game/join"
            _hover={{ textDecoration: 'underline' }}
            color="blue.500"
          >
            Try again{' '}
          </Link>{' '}
        </Text>
      </VStack>
    )
  } else if (loading) {
    body = <Spinner />
  } else {
    body = (
      <Box border="3px solid gray" borderRadius="10px" p="4">
        <Heading m="4" size="md" color="gray">
          Joined players
        </Heading>
        <UnorderedList spacing={6} listStyleType="none">
          {players?.map((player) => {
            const { isGuest, username } = player
            return (
              <ListItem>
                <Divider />
                <HStack paddingTop="3">
                  {isGuest ? (
                    <Tag colorScheme="teal"> guest </Tag>
                  ) : (
                    <Tag colorScheme="blue"> user</Tag>
                  )}
                  <Text fontSize="xl"> {username}</Text>
                </HStack>
              </ListItem>
            )
          })}
        </UnorderedList>
      </Box>
    )
  }

  return (
    <VStack spacing={8}>
      <Heading size="lg" color="gray">
        Room #{roomID}
      </Heading>
      {body}
    </VStack>
  )
}

export default SocketGameComponent(JoinRoom, false)
