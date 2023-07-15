'use client'
import { Inter } from 'next/font/google'
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
import { JSXElementConstructor, ReactElement, useState } from 'react'
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
import { Player } from '@/socket/types'

const HeadText = () => {
  return (
    <Heading size="lg">
      <Link
        href="/"
        _hover={{
          color: useColorModeValue('typeboutGray.800', 'typeboutGray.50'),
          textDecoration: 'none',
          opacity: 0.6
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

interface NavProps {
  isLoggedIn: boolean
  logout: () => void
  toggleColorMode: () => void
  colorMode: 'light' | 'dark'
  user?: Player
}

const RegularNav = ({
  isLoggedIn,
  logout,
  toggleColorMode,
  colorMode,
  user
}: NavProps) => {
  const color = useColorModeValue('typeBoutGray.800', 'whiteAlpha.900')
  const hoverColor = useColorModeValue('typeboutGray.300', 'typeboutGray.200')
  return (
    <HStack spacing={20} fontSize="1.2rem">
      {isLoggedIn ? (
        <>
          <Tooltip label="Profile">
            <Link
              href={'/users/profile/' + user?.username}
              _hover={{
                textDecoration: 'none'
              }}
            >
              <IconButton
                icon={<FaUserCircle fontSize="1.5rem" />}
                aria-label="Profile"
                variant="ghost"
                color={color}
                _hover={{
                  color: hoverColor
                }}
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
              color={color}
              _hover={{
                color: hoverColor
              }}
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
          icon={
            colorMode === 'light' ? (
              <MoonIcon fontSize="1.5rem" />
            ) : (
              <SunIcon fontSize="1.5rem" />
            )
          }
          aria-label="Toggle dark mode"
          variant="ghost"
          color={color}
          _hover={{
            color: hoverColor
          }}
        />
      </Tooltip>
    </HStack>
  )
}

const MobileNav = ({
  isLoggedIn,
  logout,
  toggleColorMode,
  colorMode,
  user
}: NavProps) => {
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
            <Link href={'/users/profile/' + user?.username}>
              <MenuItem icon={<AiOutlineUser />}>Profile</MenuItem>
            </Link>
            <MenuItem icon={<BiLogOutCircle />} onClick={logout}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <Link href="/users/login">
              <MenuItem icon={<MdOutlineLogin />}> Login</MenuItem>
            </Link>
            <Link href="/users/signup">
              <MenuItem icon={<FaUserPlus />}>Sign up</MenuItem>
            </Link>
          </>
        )}
        <Link href="/game/createRoom">
          <MenuItem icon={<MdCreate />}>Create game</MenuItem>
        </Link>
        <Link href="/game/join">
          <MenuItem icon={<ArrowLeftIcon />}>Join game</MenuItem>
        </Link>

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
  const { user, logout } = useAuth()
  const { colorMode, toggleColorMode } = useColorMode()
  const isLoggedIn = (user || false) && !user.isGuest!
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
        <MobileNav
          isLoggedIn={isLoggedIn}
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
          logout={logout}
          user={user}
        />
      </Box>
      <Box display={{ base: 'none', md: 'block' }}>
        <RegularNav
          isLoggedIn={isLoggedIn}
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
          logout={logout}
          user={user}
        />
      </Box>
    </Flex>
  )
}
