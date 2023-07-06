'use client'
import styles from '../page.module.css'
import { FormEvent, useState } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Stack,
  Heading,
  HStack,
  Box,
  Spinner,
  VStack,
  StackDivider,
  PinInput,
  PinInputField,
  Center,
  Fade
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { LoadingPage } from '@/components/LoadingPage'

export default function Join() {
  const { becomeGuest } = useAuth()
  const router = useRouter()
  const [value, setValue] = useState<string>('')
  const [isJoiningRoom, setIsJoiningRoom] = useState(false)

  const handleSubmit = (roomNumber: string) => {
    setIsJoiningRoom(true)
    router.push(`/game/joinRoom?room=${roomNumber.toUpperCase()}`)
  }

  const capitalize = (input: string) => {
    setValue(input.toUpperCase())
  }

  return (
    <Box>
      <Center>
        <Stack align="center">
          {isJoiningRoom ? (
            <Fade in>
              <Heading m="7">Trying to join {value}...</Heading>
            </Fade>
          ) : (
            <Heading m="7">Enter the room code</Heading>
          )}

          <VStack spacing={6}>
            <HStack>
              <PinInput
                type="alphanumeric"
                autoFocus
                onComplete={handleSubmit}
                onChange={capitalize}
                value={value}
                size={['md', 'lg']}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            <StackDivider />
            {isJoiningRoom && <Spinner />}
          </VStack>
        </Stack>
      </Center>
    </Box>
  )
}
