/**
 * AR Quiz Types
 * Types for AR interactive quiz experience
 */

export interface ARQuizQuestion {
  id: number
  question: string
  breed: string
  modelId: string
  petType: 'cat' | 'dog'
  points: number
  description: string
  hint?: string
}

export type ARQuizState = 'loading' | 'intro' | 'placing' | 'playing' | 'correct' | 'complete'

export interface ARQuizResult {
  questionId: number
  isCorrect: boolean
  points: number
  timeTaken: number
}

export interface ARQuizSession {
  participantId: string
  startTime: Date
  endTime?: Date
  totalPoints: number
  results: ARQuizResult[]
}
