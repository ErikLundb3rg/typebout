'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { AuthProvider } from '@/providers/useAuth'
import { theme } from '@/theme'
import { Footer } from '@/components/Footer'
import { Text } from '@chakra-ui/react'
import Header from '@/components/Header'
import '@fontsource/raleway/600.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/open-sans/400.css'
import { PropsWithChildren } from 'react'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const Body = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box display="flex" flexDirection="column" minH="100vh">
          <Header />
          {children}
          <Footer />
        </Box>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default Body
