import styles from '../page.module.css'
import { FormEvent } from 'react'
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
  Box,
  Center,
  Input,
  VStack,
  StackDivider
} from '@chakra-ui/react'

const BecomeGuest = () => {
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
    <Box>
      <Center>
        <Stack align="center">
          <Heading m="7" size="md" color="gray">
            Enter a nickname to play as
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={4}
              align="stretch"
            >
              <Input name="username" placeholder="e.g lucbror" />
              <Button type="submit" colorScheme="teal" size="lg">
                Play
              </Button>
            </VStack>
          </form>
        </Stack>
      </Center>
    </Box>
  )
}

export default BecomeGuest
