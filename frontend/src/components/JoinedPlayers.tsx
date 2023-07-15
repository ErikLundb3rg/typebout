import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Heading,
  HStack,
  Text,
  Button,
  Box,
  Input,
  VStack,
  useClipboard,
  Tag,
  Spinner,
  ListItem,
  UnorderedList,
  Flex,
  Divider,
  Center
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import TypeCard from '@/components/TypeCard'
import { Player } from '@/socket/types'

interface JoinedPlayersProps {
  players: Player[]
}

export const JoinedPlayers = ({ players }: JoinedPlayersProps) => {
  return (
    <TypeCard header="Joined Players">
      <UnorderedList spacing={6} listStyleType="none">
        {players?.map((player, index) => {
          const { isGuest, username } = player
          return (
            <ListItem key={index}>
              <Divider />
              <HStack paddingTop="3">
                {isGuest ? (
                  <Tag colorScheme="sandyBrown"> guest </Tag>
                ) : (
                  <Tag colorScheme="burntSienna"> user</Tag>
                )}
                {isGuest ? (
                  <Text fontSize="xl"> {username}</Text>
                ) : (
                  <Link href={'/users/profile/' + username}>
                    <Button
                      variant="link"
                      colorScheme="charcoal"
                      textDecoration="underline"
                    >
                      {username}
                    </Button>
                  </Link>
                )}
              </HStack>
            </ListItem>
          )
        })}
      </UnorderedList>
    </TypeCard>
  )
}
