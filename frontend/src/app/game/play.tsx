'use client'
import styles from '../page.module.css'
import { useEffect, useState } from 'react'
import { Quote, TypeBoutSocket, GameInformation } from '@/socket/types'
import { getAutomaticTypeDirectiveNames } from 'typescript'

interface PlayGameProps {
  count: number
  quote: Quote
  gameStarted: boolean
  onCorrectWord: (word: string) => void
  gameInfoArr: GameInformation[] | null
}

const splitStringIncludeSpaces = (str: string) => {
  const res: string[] = []
  let curr = []
  for (let i = 0; i < str.length; i++) {
    curr.push(str[i])
    if (str[i] === ' ') {
      res.push(curr.join(''))
      curr = []
    }
  }
  if (curr.length > 0) {
    res.push(curr.join(''))
  }
  return res
}

// This godforsaken component has some bad logic
export default function PlayGame({
  count,
  quote,
  gameStarted,
  onCorrectWord,
  gameInfoArr
}: PlayGameProps) {
  const splitContent = splitStringIncludeSpaces(quote.content)
  const [completedContent, setCompletedContent] = useState('')
  const [currentWord, setCurrentWord] = useState(splitContent[0])
  const [upComingContent, setUpComingContent] = useState(
    splitContent.filter((_, idx) => idx !== 0)
  )
  const [correctIndex, setCorrectIndex] = useState<number>(-1)
  const [wrongIndex, setWrongIndex] = useState<number>(-1)
  const [completed, setCompleted] = useState(false)

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (!gameStarted) {
      // @ts-ignore
      document.getElementById('input-form')?.reset()
    }
    const input = event.currentTarget.value

    let isFaulty = false
    let correctIdx = -1
    let wrongIdx = -1
    for (let i = 0; i < input.length; i++) {
      if (i >= currentWord.length) {
        return
      }
      const char = input[i]

      if (char === currentWord[i] && !isFaulty) {
        correctIdx = i
      } else {
        isFaulty = true
        wrongIdx = i
      }
    }

    if (correctIdx === currentWord.length - 1) {
      // @ts-ignore
      document.getElementById('input-form')?.reset()
      const newCompletedContent = completedContent + currentWord
      setCompletedContent(newCompletedContent)
      setCurrentWord(upComingContent[0])

      const tmp = upComingContent
      tmp.shift()
      setUpComingContent(tmp)

      setCorrectIndex(-1)
      setWrongIndex(-1)
      onCorrectWord(input)

      if (newCompletedContent.length === quote.content.length) {
        setCompleted(true)
      }
    } else {
      setCorrectIndex(correctIdx)
      setWrongIndex(wrongIdx)
    }
  }
  return (
    <div className={styles.description}>
      <h2> Play the game here :D </h2>
      <p> Countdown: {count && count}</p>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <span style={{ color: 'gray' }}>{completedContent}</span>
        {completedContent && <pre> </pre>}
        <span style={{ display: 'flex', flexDirection: 'row' }}>
          {currentWord?.split('').map((c, index) => {
            if (correctIndex >= index) {
              return (
                <div key={index} style={{ color: 'green' }}>
                  {c}
                </div>
              )
            }

            if (wrongIndex >= index) {
              return (
                <div key={index} style={{ color: 'red' }}>
                  {c}
                </div>
              )
            }

            return <div key={index}> {c} </div>
          })}
        </span>
        <pre> </pre>
        <span>
          {upComingContent.map((word, idx) => {
            return <span key={idx}> {word} </span>
          })}
        </span>
      </div>
      <form id="input-form">
        {!completed && (
          <input onChange={handleInputChange} autoFocus id="type_input" />
        )}
      </form>

      <div>
        {gameInfoArr?.map((g) => {
          const { color, username, wpm } = g
          return (
            <p style={{ color: color }}>
              {' '}
              {username} -- wpm: {wpm}{' '}
            </p>
          )
        })}
      </div>
    </div>
  )
}
