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

interface PerformancesTableProps {
  path: string
}

const performancesTable = ({ path }: PerformancesTableProps) => {
  const { data, error, isLoading } = useSWR(path, fetcherGet)

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
          {data?.data.performances.map(
            (performance: PerformanceProps, index: number) => {
              const { username, timeFromNow, wpm } = performance
              return (
                <Tr key={index}>
                  <Td> {timeFromNow} </Td>
                  <Td> {username} </Td>
                  <Td isNumeric>{wpm}</Td>
                </Tr>
              )
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default performancesTable
