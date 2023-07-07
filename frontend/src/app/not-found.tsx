'use client'
import React from 'react'
import { VStack, Heading, Center, Text } from '@chakra-ui/react'

const NotFound = () => {
  return (
    <Center p={3}>
      <VStack spacing={4}>
        <Heading> 404 Not found</Heading>
        <Text> We could not find the page you're looking for ¯\_(ツ)_/¯</Text>
      </VStack>
    </Center>
  )
}

export default NotFound
