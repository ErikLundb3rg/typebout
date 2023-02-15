import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/providers/useAuth'
import React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>
}
