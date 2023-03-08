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
  Th
} from '@chakra-ui/react'

interface PerformanceProps {
  username: string
  wpm: string
  timeFromNow: string
}

const profile = () => {
  // const { data, error, isLoading } = useSWR(path, fetcherGet)

  const user 

  if (error || isLoading) {
    return <></>
  }

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="telegram" size="sm">
        <Thead>
          <Tr>
            <Th>Time</Th>
            <Th>Username</Th>
            <Th isNumeric>wpm</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data.performances.map((performance: PerformanceProps) => {
            const { username, timeFromNow, wpm } = performance
            return (
              <Tr>
                <Td> {timeFromNow} </Td>
                <Td> {username} </Td>
                <Td isNumeric>{wpm}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export defaultprofile 
