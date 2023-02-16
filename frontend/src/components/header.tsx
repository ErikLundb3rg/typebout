'use client'
import { Inter } from '@next/font/google'
import useAuth from '@/providers/useAuth'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Highlight,
  Heading,
  Spacer,
  useColorMode
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const inter = Inter({ subsets: ['latin'] })

export default function Header() {
  const { user } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()

  const isLoggedIn = user && !user.isGuest!

  return (
    <Flex px="8" py="4" align="center">
      <Heading size="lg">
        {' '}
        <Link href="/"> TypeBout </Link>
      </Heading>
      <Spacer />
      <Spacer />
      <Spacer />
      {!isLoggedIn && (
        <Box>
          <Link href="/users/login" px="10" _hover={{ color: 'blue.500' }}>
            Login
          </Link>
          <Link href="/users/login" px="10" _hover={{ color: 'blue.500' }}>
            Sign up
          </Link>
        </Box>
      )}
      <Spacer />
      <Text fontSize="xl">
        {user?.username}
        {user?.isGuest && (
          <Highlight
            query="guest"
            styles={{ px: '2', py: '0', rounded: 'full', bg: 'teal.100' }}
          >
            guest
          </Highlight>
        )}
      </Text>
      <Spacer />
      <IconButton m="2" aria-label="Toggle Mode" onClick={toggleColorMode}>
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </Flex>
  )
}
