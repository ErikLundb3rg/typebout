'use client'

import useAuth from '@/providers/useAuth'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'
import { PasswordField } from '@/components/passwordField'
import { Field, Form, Formik } from 'formik'
import { Link } from '@chakra-ui/next-js'

interface FormTypes {
  username: string
  password: string
}

export default function Login() {
  const { login, loading, error } = useAuth()
  const router = useRouter()

  const initialValues: FormTypes = {
    username: '',
    password: ''
  }

  const handleSubmit = (values: FormTypes) => {
    const { username, password } = values
    login(username, password)
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
                <Link href="/users/signup">
                  <Button variant="link" colorScheme="blue">
                    Sign up
                  </Button>
                </Link>
              </HStack>
            </Stack>
          </Stack>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {(props) => (
              <Form>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <Field name="username">
                      {({ field }: { field: typeof Field }) => (
                        <FormControl isInvalid={error && true}>
                          <FormLabel>Username</FormLabel>
                          <Input {...field} placeholder="e.g username123" />
                          <FormErrorMessage>{error && error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password">
                      {({ field }: { field: typeof Field }) => (
                        <FormControl>
                          <PasswordField {...field} title="Password" />
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Stack spacing="6">
                    <Button
                      type="submit"
                      variant="primary"
                      backgroundColor="cyan"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Container>
  )
}
