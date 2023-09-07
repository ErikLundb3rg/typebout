'use client'
import { useEffect, useState } from 'react'
import SocketGameComponentWrapper, {
  BeforeGameComponentProps
} from '../SocketGameComponentWrapper.tsx'
import {
  Heading,
  HStack,
  Button,
  Box,
  Input,
  VStack,
  useClipboard,
  Flex
} from '@chakra-ui/react'
import { LoadingPage } from '@/components/LoadingPage'
import TypeCard from '@/components/TypeCard'
import { TypeButtonCard } from '@/components/TypeButtonCard'
import { JoinedPlayers } from '@/components/JoinedPlayers'

const CreateRoom = ({ socket, user, players }: BeforeGameComponentProps) => {
  const [roomCode, setRoomCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { hasCopied, onCopy, setValue: setLink, value: link } = useClipboard('')

  useEffect(() => {
    socket.emit('createRoom', (link) => {
      setLink(link)
      setRoomCode(link.slice(-6))
      setLoading(false)
    })
    socket.emit('startGame')
  }, [])

  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return loading ? (
    <LoadingPage text="Creating your room..." />
  ) : (
    <VStack spacing={8} p={3}>
      <Box>
        <Heading size="md">Room</Heading>
        <Heading size="2xl" letterSpacing={2}>
          {' '}
          # {roomCode}
        </Heading>
      </Box>
      <Flex
        justifyContent="space-around"
        gap={4}
        flexWrap={['wrap-reverse', null, 'wrap']}
        flexDirection={['row-reverse', null, 'row']}
      >
        <Box flex="1" minWidth="200px">
          {players && <JoinedPlayers players={players} />}
        </Box>
        <Box flex="1" minWidth="200px">
          <TypeCard header="Room Link:">
            <HStack>
              <Input value={link} readOnly onFocus={(e) => e.target.select()} />
              <Button size="md" colorScheme="persianGreen" onClick={onCopy}>
                Copy
              </Button>
            </HStack>
          </TypeCard>
        </Box>
        <Flex flex="1" minWidth="200px">
          <TypeButtonCard header="Start game" onClick={handleStartGame} />
        </Flex>
      </Flex>
    </VStack>
  )
}

export default SocketGameComponentWrapper(CreateRoom, true)
