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
  useColorModeValue,
  CircularProgress
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
    <Card variant="filled" w="100%">
      <CardHeader pb={0}>
        <Heading size="md">Players</Heading>
      </CardHeader>
      <CardBody w="100%">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Tbody w="100%">
              {gameInfoArr.map((gameInfo, index) => {
                const {
                  color,
                  user: { username, id },
                  wpm,
                  progressPercentage
                } = gameInfo
                const placement = endgameStats.find(
                  (eg) => eg.user.id === id
                )?.placement
                return (
                  <Tr key={index}>
                    <Td
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      maxW={[100, 200, 300]}
                    >
                      {username}
                    </Td>
                    <Td w={[null, '70%']}>
                      <Progress
                        size="xs"
                        value={progressPercentage}
                        background={defaultProgressBackgroundColor}
                        colorScheme={progressPercentage > 0 ? color : undefined}
                        display={['none', 'block']}
                      />

                      <CircularProgress
                        size="1.6rem"
                        value={progressPercentage}
                        color={color}
                        trackColor={defaultProgressBackgroundColor}
                        display={['block', 'none']}
                      />
                    </Td>
                    <Td isNumeric>{wpm} wpm</Td>
                    <Td isNumeric visibility={placement ? 'visible' : 'hidden'}>
                      <Tag>{placement}</Tag>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}
