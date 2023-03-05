'use client'
import { Inter } from '@next/font/google'
import useAuth from '@/providers/useAuth'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Highlight,
  Heading,
  Spacer,
  useColorMode,
  Button,
  Stack
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import MenuToggle from '@/components/MenuToggle'
import { useState } from 'react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const inter = Inter({ subsets: ['latin'] })

const Logo = () => {
  return (
    <Heading size="lg">
      <Link href="/" _hover={{ textDecoration: 'underline' }}>
        {' '}
        TypeBout{' '}
      </Link>
    </Heading>
  )
}

const Username = ({
  username,
  isGuest
}: {
  username: string
  isGuest: boolean
}) => {
  return (
    <Text fontSize="xl">
      {username}
      {isGuest && (
        <Highlight
          query="guest"
          styles={{ px: '2', py: '0', rounded: 'full', bg: 'teal.100' }}
        >
          guest
        </Highlight>
      )}
    </Text>
  )
}

const MenuLinks = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}
      >
        <Link
          href="/users/login"
          _hover={{ color: 'blue.500', textDecoration: 'underline' }}
        >
          Login
        </Link>
        <Link
          href="/users/signup"
          _hover={{ color: 'blue.500', textDecoration: 'underline' }}
        >
          Sign up
        </Link>
      </Stack>
    </Box>
  )
}

export default function Header() {
  const { user } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const isLoggedIn = user && !user.isGuest!

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={8}
    >
      <Logo />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        flexBasis={{ base: '100%', md: 'auto' }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          pt={[4, 4, 0, 0]}
        >
          {user !== undefined ? (
            <Username isGuest={user.isGuest} username={user.username} />
          ) : (
            <>
              <Link
                href="/users/login"
                _hover={{ color: 'blue.500', textDecoration: 'underline' }}
              >
                Login
              </Link>
              <Link
                href="/users/signup"
                _hover={{ color: 'blue.500', textDecoration: 'underline' }}
              >
                Sign up
              </Link>
            </>
          )}
          <IconButton m="2" aria-label="Toggle Mode" onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Flex>
  )
}
