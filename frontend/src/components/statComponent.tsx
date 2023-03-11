import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading
} from '@chakra-ui/react'

interface StatComponentProps {
  title: string
  content: string | number | undefined
}

const StatComponent = ({ content, title }: StatComponentProps) => {
  return (
    <Stat size="md">
      <StatLabel>
        <Heading color="gray" size="md">
          {title}
        </Heading>
      </StatLabel>
      <StatNumber>
        <Heading color="gray" size="3xl">
          {content}
        </Heading>
      </StatNumber>
    </Stat>
  )
}

export default StatComponent
