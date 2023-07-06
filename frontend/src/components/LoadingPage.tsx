import React from 'react'
import { VStack, Heading, Spinner } from '@chakra-ui/react'

export const LoadingPage = ({ text }: { text: string }) => {
  return (
    <VStack spacing={10}>
      <Heading size="lg">{text} </Heading>
      <Spinner />
    </VStack>
  )
}
