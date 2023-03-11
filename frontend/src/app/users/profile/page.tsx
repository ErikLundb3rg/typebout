'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcherGet } from '@/apicalls/index'
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Thead,
  Th,
  VStack
} from '@chakra-ui/react'
import StatComponent from '@/components/statComponent'

const profile = () => {
  const { data, error, isLoading } = useSWR('users/profile', fetcherGet)

  console.log('data', data)

  if (isLoading) {
    return <div></div>
  }

  if (error) {
    return <div></div>
  }
  //const user

  //if (error || isLoading) {
  //return <></>
  //}
  return <div></div>
  return (
    <VStack spacing={4}>
      <StatComponent title="wpm" content={chosenEndgameStats.wpm} />
      <StatComponent title="Time" content={`${chosenEndgameStats.time}s`} />
      <StatComponent
        title="Accuracy"
        content={`${chosenEndgameStats.accuracy}%`}
      />
      <StatComponent title="Errors" content={chosenEndgameStats.mistakes} />
    </VStack>
  )
}

export default profile
