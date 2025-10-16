import type { ARQuizQuestion } from 'src/types/ar'

/**
 * AR Quiz Questions Data
 * Simple demo with single Munchkin Cat question
 */
export const arQuizQuestions: ARQuizQuestion[] = [
  {
    id: 1,
    question: 'Temukan kucing Munchkin dengan kaki pendek yang menggemaskan!',
    breed: 'Munchkin Cat',
    modelId: 'munchkin-cat',
    petType: 'cat',
    points: 100,
    description: 'Munchkin Cat adalah ras kucing unik dengan kaki pendek alami. Mereka terkenal dengan tubuh yang aktif dan temperamen yang ramah!',
    hint: 'Cari kucing dengan ciri khas kaki yang pendek'
  }
]

// Get question by ID
export function getQuestionById(id: number): ARQuizQuestion | undefined {
  return arQuizQuestions.find(q => q.id === id)
}

// Get total possible points
export function getTotalPossiblePoints(): number {
  return arQuizQuestions.reduce((sum, q) => sum + q.points, 0)
}
