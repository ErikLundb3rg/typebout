'use client'
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Heading,
  Center,
  Flex
} from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'
import { ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { SwedishFlag } from './SwedishFlag'

const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactNode
  label: string
  href: string
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      marginTop="auto"
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Center>
          <Heading size="md" as="h2" display="inline-block">
            {' '}
            Typebout{' '}
          </Heading>
          <Box w="12px" display="inline-block" ml={2}>
            <Logo />
          </Box>
        </Center>

        <Flex align="inherit">
          <Text>© 2023 Typebout. Made in Sweden </Text>
          <Box width="26px" ml={2}>
            <SwedishFlag />
          </Box>
        </Flex>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Github'}
            href={'https://github.com/ErikLundb3rg/typebout'}
          >
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}
