import { FormEvent } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Stack,
  Heading,
  Text,
  Button,
  Center,
  Input,
  Fade,
  VStack,
  StackDivider
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

export const BecomeGuest = () => {
  const { becomeGuest } = useAuth()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string | undefined
    if (username) {
      becomeGuest(username)
    }
  }

  return (
    <Fade in>
      <Center>
        <Stack align="center">
          <Heading m="7" size="lg">
            Enter a nickname to play as
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack divider={<StackDivider />} spacing={4} align="stretch">
              <Input name="username" placeholder="e.g Superman" />
              <Button type="submit" colorScheme="persianGreen" size="lg">
                Play
              </Button>
            </VStack>
          </form>
          <Text>
            or{' '}
            <Link href="/users/login">
              <Button variant="link" colorScheme="saffron">
                Login
              </Button>
            </Link>{' '}
            to your account
          </Text>
        </Stack>
      </Center>
    </Fade>
  )
}
