'use client'
import { useState } from 'react'
import useAuth from '@/providers/useAuth'
import { FormEvent, useEffect } from 'react'
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
import { Field, Form, Formik } from 'formik'
import { PasswordField } from '@/components/passwordField'
import { Link } from '@chakra-ui/next-js'

interface FormTypes {
  username: string
  password: string
  confirmPassword: string
}

export default function SignUp() {
  const { register, error } = useAuth()
  const router = useRouter()
  const [formErrors, setFormErrors] = useState<FormTypes>({
    confirmPassword: '',
    password: '',
    username: ''
  })

  useEffect(() => {
    if (error?.validationError) {
      const { validationError } = error
      validationError.details.forEach((detail: any) => {
        const {
          path: { key },
          message
        } = detail
        formErrors[key as keyof FormTypes] = message
      })
    }
  }, [error])

  const initialValues: FormTypes = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  const handleSubmit = (values: FormTypes) => {
    const { username, password, confirmPassword } = values
    register(username, password, confirmPassword)
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
                Register an account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Already have an account?</Text>
                <Link href="/users/login">
                  <Button variant="link" colorScheme="blue">
                    Login
                  </Button>
                </Link>
              </HStack>
              <Text color="red"> {error?.networkError}</Text>
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
                          <FormErrorMessage>
                            {error?.networkError}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password">
                      {({ field }: { field: typeof Field }) => (
                        <FormControl>
                          <PasswordField {...field} title={'Password'} />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="confirmPassword">
                      {({ field }: { field: typeof Field }) => (
                        <FormControl>
                          <PasswordField
                            {...field}
                            title={'Confirm  password'}
                          />
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
                      Sign up
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
