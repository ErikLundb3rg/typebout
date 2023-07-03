'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SocketGameComponent, {
  BeforeGameComponentProps
} from '../SocketGameComponentWrapper.tsx'
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
import TypeCard from '@/components/TypeCard'

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
      <TypeCard
        header="Failed to join room"
        path="join"
        buttonTitle="Try again"
      >
        <Text> Are you sure you entered the correct Room ID? </Text>
      </TypeCard>
    )
  } else if (loading) {
    body = (
      <>
        <Spinner />
      </>
    )
  } else {
    body = (
      <Box minWidth={['100%', '400px']}>
        <TypeCard header="Joined Players">
          <UnorderedList spacing={6} listStyleType="none">
            {players?.map((player, index) => {
              const { isGuest, username } = player
              return (
                <ListItem key={index}>
                  <Divider />
                  <HStack paddingTop="3">
                    {isGuest ? (
                      <Tag colorScheme="sandyBrown"> guest </Tag>
                    ) : (
                      <Tag colorScheme="burntSienna"> user</Tag>
                    )}
                    <Text fontSize="xl"> {username}</Text>
                  </HStack>
                </ListItem>
              )
            })}
          </UnorderedList>
        </TypeCard>
      </Box>
    )
  }

  return (
    <VStack spacing={8} p={3}>
      <Box>
        <Heading size="md">Room</Heading>
        <Heading size="2xl" letterSpacing={2}>
          # {roomID}
        </Heading>
      </Box>
      {body}
    </VStack>
  )
}

export default SocketGameComponent(JoinRoom, false)
