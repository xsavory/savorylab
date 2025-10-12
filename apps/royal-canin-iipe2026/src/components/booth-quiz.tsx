import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { activityLog, participants, QUERY_KEYS } from 'src/lib/api'
import { Activity } from 'src/types/schema'
import useParticipantAuth from 'src/hooks/use-participant-auth'

interface BoothQuizProps {
  menuId: 'vet-edu-quiz' | 'sustainability-quiz'
}

interface Answer {
  text: string
  isCorrect: boolean
  points: number
}

interface Question {
  id: number
  question: string
  answers: Answer[]
}

// Vet Education Quiz Questions
const vetEduQuestions: Question[] = [
  {
    id: 1,
    question: 'Apa nutrisi utama yang dibutuhkan kucing untuk kesehatan mata dan jantung?',
    answers: [
      { text: 'Vitamin C', isCorrect: false, points: 0 },
      { text: 'Taurine', isCorrect: true, points: 20 },
      { text: 'Kalsium', isCorrect: false, points: 0 },
      { text: 'Vitamin D', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 2,
    question: 'Berapa kali sebaiknya anjing dewasa diberi makan per hari?',
    answers: [
      { text: '1 kali', isCorrect: false, points: 0 },
      { text: '2 kali', isCorrect: true, points: 20 },
      { text: '3 kali', isCorrect: false, points: 0 },
      { text: '4 kali', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 3,
    question: 'Apa tanda-tanda dehidrasi pada hewan peliharaan?',
    answers: [
      { text: 'Gusi kering dan kulit tidak elastis', isCorrect: true, points: 20 },
      { text: 'Tidur lebih lama', isCorrect: false, points: 0 },
      { text: 'Nafsu makan meningkat', isCorrect: false, points: 0 },
      { text: 'Bulu berkilau', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 4,
    question: 'Pada usia berapa sebaiknya anak kucing mulai divaksinasi?',
    answers: [
      { text: '2 minggu', isCorrect: false, points: 0 },
      { text: '4 minggu', isCorrect: false, points: 0 },
      { text: '6-8 minggu', isCorrect: true, points: 20 },
      { text: '12 minggu', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 5,
    question: 'Apa manfaat utama protein dalam makanan hewan peliharaan?',
    answers: [
      { text: 'Memberi energi cepat', isCorrect: false, points: 0 },
      { text: 'Membangun dan memperbaiki jaringan tubuh', isCorrect: true, points: 20 },
      { text: 'Mengatur suhu tubuh', isCorrect: false, points: 0 },
      { text: 'Meningkatkan nafsu makan', isCorrect: false, points: 0 },
    ],
  },
]

// Sustainability Quiz Questions
const sustainabilityQuestions: Question[] = [
  {
    id: 1,
    question: 'Apa yang dimaksud dengan "carbon pawprint" dalam konteks hewan peliharaan?',
    answers: [
      { text: 'Jejak karbon dari makanan dan produk hewan peliharaan', isCorrect: true, points: 20 },
      { text: 'Jejak kaki hewan di tanah', isCorrect: false, points: 0 },
      { text: 'Bekas gigitan hewan', isCorrect: false, points: 0 },
      { text: 'Tanda tangan pemilik hewan', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 2,
    question: 'Bahan kemasan apa yang paling ramah lingkungan untuk makanan hewan?',
    answers: [
      { text: 'Plastik sekali pakai', isCorrect: false, points: 0 },
      { text: 'Styrofoam', isCorrect: false, points: 0 },
      { text: 'Kertas daur ulang atau biodegradable', isCorrect: true, points: 20 },
      { text: 'Aluminium foil', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 3,
    question: 'Apa cara terbaik untuk mengurangi limbah dari kotoran hewan peliharaan?',
    answers: [
      { text: 'Membuang ke sungai', isCorrect: false, points: 0 },
      { text: 'Menggunakan kantong biodegradable dan komposting', isCorrect: true, points: 20 },
      { text: 'Membiarkan di tanah', isCorrect: false, points: 0 },
      { text: 'Membakarnya', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 4,
    question: 'Sumber protein mana yang lebih berkelanjutan untuk makanan hewan?',
    answers: [
      { text: 'Daging sapi impor', isCorrect: false, points: 0 },
      { text: 'Protein serangga atau ikan berkelanjutan', isCorrect: true, points: 20 },
      { text: 'Daging liar', isCorrect: false, points: 0 },
      { text: 'Daging olahan', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 5,
    question: 'Bagaimana cara mengurangi jejak air dalam merawat hewan peliharaan?',
    answers: [
      { text: 'Tidak memandikan hewan', isCorrect: false, points: 0 },
      { text: 'Menggunakan produk hemat air dan mengurangi frekuensi mandi', isCorrect: true, points: 20 },
      { text: 'Memandikan di sungai', isCorrect: false, points: 0 },
      { text: 'Tidak memberi minum', isCorrect: false, points: 0 },
    ],
  },
]

function BoothQuiz({ menuId }: BoothQuizProps) {
  const { user } = useParticipantAuth()
  const participantId = user?.id || ''
  const queryClient = useQueryClient()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const questions = menuId === 'vet-edu-quiz' ? vetEduQuestions : sustainabilityQuestions
  const currentQuestion = questions[currentQuestionIndex]
  const rawProgress = (answers.length / questions.length) * 100
  const progress = Math.round(rawProgress / 10) * 10

  const activity = menuId === 'vet-edu-quiz' ? Activity.VetEduQuiz : Activity.SustainabilityQuiz

  // Check if participant has already played this quiz
  const { data: activityData, isLoading: isCheckingActivity } = useQuery({
    queryKey: ['activity', participantId, activity],
    queryFn: async () => {
      const response = await activityLog.getByParticipant(participantId)
      if (response.error) throw new Error(response.error || 'Failed to get data');
      return response.data
    },
    enabled: !!participantId,
  })

  // Check if activity exists for this quiz
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPlayedQuiz = Array.isArray((activityData as any)?.rows)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (activityData as any).rows.some((log: any) => log.activity === activity)
    : false

  // Submit quiz result mutation
  const submitMutation = useMutation({
    mutationFn: async (points: number) => {
      const response = await participants.submitQuizResult({
        participantId,
        activity,
        points,
      })
      if (response.error) throw new Error(response.error || 'Submit failed');
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.participants
      })
    }
  })

  const handleAnswerSelect = (answer: Answer, index: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setSelectedAnswerIndex(index)
    setShowFeedback(true)

    // Wait for feedback animation
    setTimeout(() => {
      const newAnswers = [...answers, answer.isCorrect]
      setAnswers(newAnswers)

      if (answer.isCorrect) {
        setTotalPoints((prev) => prev + answer.points)
      }

      setShowFeedback(false)
      setSelectedAnswerIndex(null)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setIsTransitioning(false)
      } else {
        // Quiz complete
        const finalPoints = answer.isCorrect ? totalPoints + answer.points : totalPoints
        setIsComplete(true)

        // Log results
        logQuizResults({
          quizType: menuId,
          totalQuestions: questions.length,
          correctAnswers: newAnswers.filter(Boolean).length,
          totalPoints: finalPoints,
          timestamp: new Date().toISOString(),
        })

        // Submit quiz result
        submitMutation.mutate(finalPoints)
      }
    }, 1500)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logQuizResults = (data: any) => {
    console.log('=== BOOTH QUIZ RESULTS ===')
    console.log('Quiz Type:', data.quizType)
    console.log('Total Questions:', data.totalQuestions)
    console.log('Correct Answers:', data.correctAnswers)
    console.log('Total Points:', data.totalPoints)
    console.log('Timestamp:', data.timestamp)
    console.log('==========================')
  }

  // Show loading state when checking activity
  if (isCheckingActivity) {
    return (
      <div className="bg-gradient-to-b from-white to-primary/5 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-gray-600">Memuat quiz...</p>
        </div>
      </div>
    )
  }

  // Show message if already played
  if (hasPlayedQuiz) {
    return (
      <div className="bg-gradient-to-b from-white to-primary/5 flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Sudah Pernah Dimainkan
            </h2>
            <p className="text-gray-600">
              Anda sudah pernah memainkan quiz ini sebelumnya. Setiap participant hanya dapat memainkan quiz satu kali.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Results screen
  if (isComplete) {
    const correctAnswersCount = answers.filter(Boolean).length
    const percentage = Math.round((correctAnswersCount / questions.length) * 100)

    return (
      <div className="bg-gradient-to-b from-white to-primary/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
            {submitMutation.isPending && (
              <div className="mb-4 flex items-center justify-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Menyimpan hasil...</span>
              </div>
            )}

            {submitMutation.isError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  Gagal menyimpan hasil quiz. Silakan coba lagi.
                </p>
              </div>
            )}

            {submitMutation.isSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Hasil quiz berhasil disimpan!
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Quiz Selesai!
            </h2>

            <div className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-primary/10 rounded-xl"
              >
                <div className="text-5xl font-black text-primary mb-2">
                  {totalPoints}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  TOTAL POIN
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {correctAnswersCount}
                  </div>
                  <div className="text-xs text-gray-600">
                    Jawaban Benar
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-600 mb-1">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-600">
                    Akurasi
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500"
            >
              {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👏 Good Job!' : '💪 Keep Learning!'}
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-white to-primary/5 flex items-start justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-foreground/60 mb-2 font-semibold">
            <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-primary rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <p className="text-lg font-bold text-white leading-snug">
            {currentQuestion?.question}
          </p>
        </motion.div>

        {/* Answer options */}
        <div className="space-y-3">
          {(currentQuestion?.answers || []).map((answer, index) => {
            const isSelected = selectedAnswerIndex === index
            const showCorrect = showFeedback && answer.isCorrect
            const showIncorrect = showFeedback && isSelected && !answer.isCorrect

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(answer, index)}
                disabled={isTransitioning}
                className={`w-full text-foreground font-semibold py-5 px-6 rounded-xl text-left border-2 relative overflow-hidden group transition-all ${
                  isTransitioning ? 'cursor-not-allowed' : ''
                } ${
                  showCorrect
                    ? 'bg-green-50 border-green-500'
                    : showIncorrect
                    ? 'bg-red-50 border-red-500'
                    : 'bg-white border-gray-200 hover:border-primary'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isTransitioning ? { scale: 1.02 } : {}}
                whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                style={{
                  boxShadow: showCorrect || showIncorrect ? 'none' : '0 2px 0 0 rgba(229, 231, 235, 0.8)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 block text-sm leading-relaxed pr-8">
                    {answer.text}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BoothQuiz
