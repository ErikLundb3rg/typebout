'use client'
import { LegacyRef, useState } from 'react'
import useAuth from '@/providers/useAuth'
import { useRef } from 'react'
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
  Text,
  Fade,
  useToast,
  useColorModeValue
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { PasswordField } from '@/components/PasswordField'
import { Link } from '@chakra-ui/next-js'
import { SignUpProps } from '@/types'
import ReCAPTCHA from 'react-google-recaptcha'

export default function SignUp() {
  const { register, networkError, loading } = useAuth()
  const captchaRef = useRef<ReCAPTCHA>(null)
  const [captchaError, setCaptchaError] = useState('')

  const [formErrors, setFormErrors] = useState<SignUpProps>({
    confirmPassword: '',
    password: '',
    username: ''
  })

  const initialValues: SignUpProps = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  const handleSubmit = async (values: SignUpProps) => {
    const { username, password, confirmPassword } = values

    const captcha = captchaRef.current?.getValue()

    if (!captcha) {
      setCaptchaError('Please complete the captcha')
      return
    }

    captchaRef.current?.reset()
    const validationError = await register(
      username,
      password,
      confirmPassword,
      captcha
    )
    if (validationError) {
      setFormErrors(validationError)
      setCaptchaError(validationError.captcha)
    }
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Fade in>
        <Stack spacing="8">
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={{ base: 'transparent', sm: 'bg-surface' }}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            backgroundColor={['none', useColorModeValue('gray.50', 'gray.700')]}
          >
            <Stack spacing="6">
              <Stack spacing={{ base: '2', md: '4' }} textAlign="center">
                <Heading size="lg">Register an account</Heading>
                <HStack spacing="1" justify="center">
                  <Text color="muted">Already have an account?</Text>
                  <Link href="/users/login">
                    <Button variant="link" colorScheme="saffron">
                      Login
                    </Button>
                  </Link>
                </HStack>
                <Text color="red"> {networkError}</Text>
              </Stack>
            </Stack>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(props) => (
                <Form>
                  <Stack spacing="6">
                    <Field name="username">
                      {({ field }: { field: typeof Field }) => (
                        <FormControl isInvalid={formErrors.username !== ''}>
                          <FormLabel>Username</FormLabel>
                          <Input {...field} placeholder="e.g username123" />
                          <FormErrorMessage>
                            {formErrors.username}{' '}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password">
                      {({ field }: { field: typeof Field }) => (
                        <PasswordField
                          {...field}
                          title={'Password'}
                          error={formErrors.password}
                        />
                      )}
                    </Field>
                    <Field name="confirmPassword">
                      {({ field }: { field: typeof Field }) => (
                        <PasswordField
                          {...field}
                          title={'Confirm  password'}
                          error={formErrors.confirmPassword}
                        />
                      )}
                    </Field>

                    <FormControl isInvalid={captchaError !== ''}>
                      <FormLabel htmlFor="Captcha">Captcha</FormLabel>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
                        ref={captchaRef}
                        theme={useColorModeValue('light', 'dark')}
                      />
                      <FormErrorMessage> {captchaError} </FormErrorMessage>
                    </FormControl>
                    <Button type="submit" colorScheme="persianGreen">
                      Sign up
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Fade>
    </Container>
  )
}
