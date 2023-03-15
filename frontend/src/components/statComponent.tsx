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

const StatComponent = ({ content, title }: StatComponentProps) => {
  return (
    <Stat size="md">
      <StatNumber>
        <Heading color="gray" size="3xl">
          {content}
        </Heading>
      </StatNumber>
      <StatLabel>
        <Heading color="gray" size="md">
          {title}
        </Heading>
      </StatLabel>
    </Stat>
  )
}

export default StatComponent
