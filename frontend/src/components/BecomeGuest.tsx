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
  StackDivider,
  InputGroup,
  InputLeftElement,
  Box
} from '@chakra-ui/react'
import { PhoneIcon, EmailIcon, EditIcon } from '@chakra-ui/icons'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import fs from 'fs'

export const BecomeGuest = () => {
  const { becomeGuest } = useAuth()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string | undefined
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    console.log('Received formdata', formData)
    if (username) {
      becomeGuest(username.replace(' ', '_'), email, phone)
    }
  }

  return (
    <Fade in>
      <Center>
        <Stack align="center">
          <form onSubmit={handleSubmit}>
            <VStack spacing={3} align="stretch">
              <Heading size="sm">För och efternamn</Heading>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EditIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  name="username"
                  type="text"
                  placeholder="Förnamn Efternamn"
                />
              </InputGroup>

              <Heading size="sm">Email</Heading>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.300" />
                </InputLeftElement>
                <Input name="email" type="email" placeholder="user@gmail.com" />
              </InputGroup>

              <Heading size="sm">Telefon (valfritt) </Heading>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PhoneIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  isRequired={false}
                  name="phone"
                  type="tel"
                  placeholder="07..."
                />
              </InputGroup>

              <Checkbox m={3} maxW={300} isRequired>
                Jag godkänner att Lunds Akademiska Biljettbyrå sparar mina
                uppgifter
              </Checkbox>

              <Button type="submit" size="lg">
                Play
              </Button>
            </VStack>
          </form>
        </Stack>
      </Center>
    </Fade>
  )
}
