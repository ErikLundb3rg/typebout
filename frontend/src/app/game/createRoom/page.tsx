'use client'
import { useEffect, useState } from 'react'
import SocketGameComponentWrapper, {
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
  }, [])

  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return loading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Flex justifyContent="space-evenly">
      <VStack spacing={8}>
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
        <Button size="md" colorScheme="teal" onClick={handleStartGame}>
          Start game
        </Button>
      </VStack>
      <VStack spacing={8}>
        <Heading size="lg" color="gray">
          {' '}
          Room #{roomCode}
        </Heading>

        <Heading size="sm" color="gray">
          Share this link with your friends:
        </Heading>
        <HStack>
          <Input value={link} onFocus={(e) => e.target.select()} />
          <Button size="md" colorScheme="teal" onClick={onCopy}>
            Copy
          </Button>
        </HStack>
      </VStack>
    </Flex>
  )
}

//<div className={styles.description}>
//<h2> Hello {user.username} </h2>
//<p> We create rooms here: </p>
//{link ? (
//<div>
//<p> This is your link: </p>
//<p> {link} </p>
//<button onClick={handleStartGame}> Start game </button>
//</div>
//) : (
//<button> Create room</button>
//)}
//{players?.map((player) => {
//const { isGuest, username } = player
//return (
//<p key={username}>
//{' '}
//{username}: {isGuest && 'guest'}{' '}
//</p>
//)
//})}
//</div>

export default SocketGameComponentWrapper(CreateRoom)
