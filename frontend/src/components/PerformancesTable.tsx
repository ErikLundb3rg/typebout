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
  Spinner,
  Text,
  Skeleton,
  Tfoot,
  Link,
  Button
} from '@chakra-ui/react'
import TypeCard from './TypeCard'

interface PerformanceProps {
  username: string
  wpm: string
  timeFromNow: string
}

interface PerformancesTableProps {
  path: string
  header: string
}

export const PerformancesTable = ({ path, header }: PerformancesTableProps) => {
  const { data, error, isLoading } = useSWR(path, (url) => fetcherGet<any>(url))

  return (
    <TypeCard header={header}>
      {error ? (
        <Text> Failed to fetch data </Text>
      ) : (
        <Skeleton isLoaded={!isLoading}>
          <TableContainer>
            <Table variant="striped" colorScheme="persianGreen" size="sm">
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
                        <Td>
                          <Link href={'/users/profile/' + username}>
                            <Button
                              variant="link"
                              colorScheme="charcoal"
                              textDecoration="underline"
                            >
                              {username}
                            </Button>
                          </Link>
                        </Td>
                        <Td isNumeric>{wpm}</Td>
                      </Tr>
                    )
                  }
                )}
              </Tbody>
              <Tfoot></Tfoot>
            </Table>
          </TableContainer>
        </Skeleton>
      )}
    </TypeCard>
  )
}
