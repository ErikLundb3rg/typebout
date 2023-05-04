'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/providers/useAuth'
import { theme } from '@/theme'
import Header from '@/components/header'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
