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
  Stack,
  HStack,
  Center,
  StackDivider,
  Divider
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import MenuToggle from '@/components/MenuToggle'
import { useState } from 'react'
import { AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

const Logo = () => {
  return (
    <Heading size="lg">
      <Link href="/" _hover={{ textDecoration: 'underline' }}>
        TypeBout⌨
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
    <Text display={['none', 'block']}>
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
  const { user, logout } = useAuth()
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
          spacing={4}
          align="center"
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          alignItems="center"
          direction={['column', 'row']}
          pt={[4, 4, 0, 0]}
        >
          {isLoggedIn ? (
            <>
              <Link
                href="/users/profile"
                _hover={{ color: 'blue.500', textDecoration: 'underline' }}
              >
                <Username isGuest={user.isGuest} username={user.username} />
              </Link>
              <Text
                onClick={logout}
                _hover={{
                  color: 'blue.500',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Logout
              </Text>
            </>
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

          <Link href="/game/createRoom">
            <IconButton
              size="sm"
              colorScheme="teal"
              icon={<AddIcon />}
              aria-label="Toggle dark mode"
            />
          </Link>

          <IconButton
            size="sm"
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle dark mode"
          />
        </Stack>
      </Box>
    </Flex>
  )
}
