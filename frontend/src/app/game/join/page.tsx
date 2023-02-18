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
  Center
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

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
          <Heading m="7" size="md" color="gray">
            Enter the room code
          </Heading>

          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={6}>
            <HStack>
              <PinInput
                type="alphanumeric"
                autoFocus
                onComplete={handleSubmit}
                onChange={capitalize}
                value={value}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            {isJoiningRoom && <Spinner />}
          </VStack>
        </Stack>
      </Center>
    </Box>
  )
}
