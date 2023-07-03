import { useEffect, useRef, useState } from 'react'
import useAuth from '@/providers/useAuth'
import {
  Quote,
  GameInformation,
  EndGameStats,
  MistakeProps
} from '@/socket/types'
import {
  Heading,
  Center,
  Text,
  Box,
  Input,
  VStack,
  Progress,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tag,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Button,
  CardFooter,
  useColorModeValue
} from '@chakra-ui/react'
import TypeCard from '../TypeCard'

interface UserTableProps {
  gameInfoArr: GameInformation[]
  endgameStats: EndGameStats[]
}

export const UserTable = ({ gameInfoArr, endgameStats }: UserTableProps) => {
  const defaultProgressBackgroundColor = useColorModeValue(
    'typeboutGray.100',
    'typeboutGray.600'
  )
  return (
    <TableContainer>
      <Card variant="filled" align="center" gap={0}>
        <CardHeader pb={0}>
          <Heading size="md">Players</Heading>
        </CardHeader>
        <CardBody overflow="auto">
          <Table variant="simple" size="sm">
            <Tbody>
              {gameInfoArr.map((gameInfo, index) => {
                const { color, username, wpm, progressPercentage } = gameInfo
                const placement = endgameStats.find(
                  (eg) => eg.username === username
                )?.placement
                return (
                  <Tr key={index}>
                    <Td
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      {' '}
                      {username} super long name super long name super long name
                      super long name super long name super long name super long
                      name super long name
                    </Td>
                    <Td>
                      <Progress
                        size="xs"
                        value={progressPercentage}
                        background={defaultProgressBackgroundColor}
                        colorScheme={progressPercentage > 0 ? color : undefined}
                      />
                    </Td>
                    <Td isNumeric>{wpm} wpm</Td>
                    {placement && (
                      <Td isNumeric>
                        <Tag>{placement}</Tag>
                      </Td>
                    )}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </TableContainer>
  )
}
