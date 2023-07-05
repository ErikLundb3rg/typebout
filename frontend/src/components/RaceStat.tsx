import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading,
  Center
} from '@chakra-ui/react'

interface StatComponentProps {
  title: string
  content: string | number | undefined
}

const RaceStat = ({ content, title }: StatComponentProps) => {
  return (
    <Stat size="md">
      <StatNumber>
        <Heading size="2xl">{content}</Heading>
      </StatNumber>
      <StatLabel>
        <Heading size="md">{title}</Heading>
      </StatLabel>
    </Stat>
  )
}

export default RaceStat
