'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcherGet } from '@/apicalls/index'
import {
  VStack,
  Heading,
  Stack,
  Flex,
  Box,
  Text,
  HStack
} from '@chakra-ui/react'
import StatComponent from '@/components/statComponent'
import useAuth from '@/providers/useAuth'

const profile = () => {
  const { data, error, isLoading } = useSWR('users/profile', fetcherGet)
  const { user } = useAuth()

  if (error) {
    return <div></div>
  }

  if (isLoading || !data) {
    return <div></div>
  }

  const {
    data: { wpmAverage, highestWpm, accuracyAverage, wpmHistory, lastRaces }
  } = data

  return (
    <Flex
      justifyContent={['space-evenly']}
      alignItems={['center', 'flex-start']}
      direction={['column', 'row']}
    >
      <VStack spacing={4} align="left">
        <Box>
          <Heading size="md"> Stats for: </Heading>
          <Heading> {user?.username}</Heading>
        </Box>
        <Heading size="md"> Latest races: </Heading>
        {lastRaces.map((race: any) => {
          const { participants, timeFromNow, quote } = race

          return (
            <Box p={4} borderRadius="5px" border="2px solid gray">
              <Heading size="sm">{timeFromNow}</Heading>
              <HStack>
                <Text as="b">Participants:</Text>
                {(participants as string[]).map(
                  (participant: string, index) => (
                    <Text>
                      {participant}
                      {index !== participant.length - 1 ? ',' : ''}
                    </Text>
                  )
                )}
              </HStack>
              <HStack>
                <Text as="b">Quote:</Text>
                <Text as="i" isTruncated maxWidth={'140px'}>
                  {' '}
                  {quote.content}{' '}
                </Text>
                <Text noOfLines={1}> - {quote.author.name} </Text>
              </HStack>
            </Box>
          )
        })}
      </VStack>
      <VStack spacing={7}>
        <StatComponent title="Average wpm " content={wpmAverage} />
        <StatComponent title="Highest wpm" content={highestWpm} />
        <StatComponent title="Accuracy average" content={accuracyAverage} />
      </VStack>
    </Flex>
  )
}

export default profile
