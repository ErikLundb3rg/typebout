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
  Divider,
  useColorModeValue,
  textDecoration,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  Tooltip
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import MenuToggle from '@/components/MenuToggle'
import { useState } from 'react'
import {
  ArrowLeftIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons'
import { Logo } from '@/components/Logo'
import { AiFillProfile, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai'

import { BsFillPlayCircleFill } from 'react-icons/bs'
import { MdCreate, MdOutlineLogin } from 'react-icons/md'
import { FaUserPlus, FaUserCircle } from 'react-icons/fa'
import { BiLogOutCircle } from 'react-icons/bi'

const inter = Inter({ subsets: ['latin'] })

const HeadText = () => {
  return (
    <Heading size="lg">
      <Link
        href="/"
        _hover={{
          color: useColorModeValue('typeboutGray.800', 'typeboutGray.50'),
          textDecoration: 'none'
        }}
      >
        <span>
          <Text display="inline-block"> Typebout </Text>
          <Box w="14px" display="inline-block" ml={2}>
            <Logo />
          </Box>
        </span>
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
    <Text>
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

const RegularNav = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, logout } = useAuth()
  const isLoggedIn = user && !user.isGuest!

  return (
    <HStack spacing={20} fontSize="1.2rem">
      {isLoggedIn ? (
        <>
          <Tooltip label="Profile">
            <Link
              href="/users/signup"
              _hover={{
                textDecoration: 'none'
              }}
            >
              <IconButton
                icon={<FaUserCircle fontSize="1.5rem" />}
                aria-label="Logout"
                variant="ghost"
                color={useColorModeValue('blackAlpha.800', 'whiteAlpha.900')}
              />
            </Link>
          </Tooltip>
          <Tooltip label="Logout">
            <IconButton
              onClick={logout}
              icon={
                <BiLogOutCircle
                  fontSize="1.5rem"
                  style={{ transform: 'rotate(180deg)' }}
                />
              }
              aria-label="Logout"
              variant="ghost"
              color={useColorModeValue('blackAlpha.800', 'whiteAlpha.900')}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <Link href="/users/login">Login</Link>
          <Link href="/users/signup">Sign up</Link>
        </>
      )}

      <Tooltip label="Toggle theme">
        <IconButton
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle dark mode"
          variant="ghost"
          color={useColorModeValue('blackAlpha.800', 'whiteAlpha.900')}
        />
      </Tooltip>
    </HStack>
  )
}

const MobileNav = () => {
  const { user, logout } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const isLoggedIn = user && !user.isGuest!

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="solid"
        colorScheme="persianGreen"
      />
      <MenuList>
        {isLoggedIn ? (
          <>
            <MenuItem icon={<AiOutlineUser />}>
              <Link href="/users/profile">Profile</Link>
            </MenuItem>
            <MenuItem icon={<BiLogOutCircle />}>
              <Link href="/users/profile">Logout</Link>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem icon={<MdOutlineLogin />}>
              <Link href="/users/login">Login</Link>
            </MenuItem>
            <MenuItem icon={<FaUserPlus />}>
              <Link href="/users/signup">Sign up</Link>
            </MenuItem>
          </>
        )}
        <MenuItem icon={<MdCreate />}>
          <Link href="/users/login">Create game</Link>
        </MenuItem>
        <MenuItem icon={<ArrowLeftIcon />}>
          <Link href="/users/signup">Join game</Link>
        </MenuItem>

        <MenuItem
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          closeOnSelect={false}
        >
          Toggle theme
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={8}
    >
      <HeadText />
      <Box display={{ base: 'block', md: 'none' }}>
        <MobileNav />
      </Box>
      <Box display={{ base: 'none', md: 'block' }}>
        <RegularNav />
      </Box>
    </Flex>
  )
}
