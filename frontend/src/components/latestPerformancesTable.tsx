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
const LatestPerformancesTable = () => {
  const { data, error, isLoading } = useSWR(
    '/races/getLatestPerformances?entries=10',
    fetcherGet
  )

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

export default LatestPerformancesTable
