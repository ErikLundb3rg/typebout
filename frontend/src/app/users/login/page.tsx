'use client'

import useAuth from '@/providers/useAuth'
import { FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'
import { PasswordField } from './passwordField'

export default function Login() {
  const { login, loading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    login(
      formData.get('username') as string,
      formData.get('password') as string
    )
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '4' }} textAlign="center">
              <Heading size={{ base: 'md', md: 'md' }}>
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Don't have an account?</Text>
                <Button variant="link" colorScheme="blue">
                  Sign up
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" />
              </FormControl>
              <PasswordField />
            </Stack>
            <Stack spacing="6">
              <Button variant="primary" backgroundColor="cyan">
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
