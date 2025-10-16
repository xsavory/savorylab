import { useState, useEffect, Suspense, useRef } from 'react'
import { ZapparCamera, InstantTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import ARScene from 'src/components/ar/ar-scene'
import ARQuizOverlay from 'src/components/ar/ar-quiz-overlay'
import { arQuizQuestions } from 'src/lib/ar-quiz-data'
import { participants, activityLog, QUERY_KEYS } from 'src/lib/api'
import { Activity } from 'src/types/schema'
import useParticipantAuth from 'src/hooks/use-participant-auth'
import type { ARQuizState } from 'src/types/ar'

interface ARQuizExperienceProps {
  onClose: () => void
}

export default function ARQuizExperience({ onClose }: ARQuizExperienceProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);

  const { user } = useParticipantAuth()
  const queryClient = useQueryClient()
  const [quizState, setQuizState] = useState<ARQuizState>('loading')
  const [currentQuestionIndex] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [hasPlacedModel, setHasPlacedModel] = useState(false)

  const currentQuestion = arQuizQuestions[currentQuestionIndex]
  const participantId = user?.id || ''

  // Check if user has already played this quiz
  const { data: activityData, isLoading: isCheckingActivity } = useQuery({
    queryKey: ['activity', participantId, Activity.ARQuiz],
    queryFn: async () => {
      const response = await activityLog.getByParticipant(participantId)
      if (response.error) throw new Error(response.error || 'Failed to get data')
      return response.data
    },
    enabled: !!participantId,
  })

  // Check if activity exists for AR Quiz
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPlayedQuiz = Array.isArray((activityData as any)?.rows)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (activityData as any).rows.some((log: any) => log.activity === Activity.ARQuiz)
    : false

  // Submit quiz result mutation
  const submitMutation = useMutation({
    mutationFn: async (points: number) => {
      const response = await participants.submitQuizResult({
        participantId,
        activity: Activity.ARQuiz,
        points,
      })
      if (response.error) throw new Error(response.error || 'Submit failed')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.participants
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.leaderboard
      })
    }
  })

  // Initialize quiz after model loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (quizState === 'loading') {
        setQuizState('intro')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [quizState])

  // Progress from intro to placing after delay
  useEffect(() => {
    if (quizState === 'intro') {
      const timer = setTimeout(() => {
        setQuizState('placing')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [quizState])

  // Handle model placement
  const handlePlacement = () => {
    if (!hasPlacedModel && quizState === 'placing') {
      setHasPlacedModel(true)
      setQuizState('playing')
    }
  }

  // Handle model click - answer quiz
  const handleModelClick = () => {
    if (quizState !== 'playing' || !currentQuestion) return

    // Correct answer! (since there's only one model)
    const earnedPoints = currentQuestion.points
    setTotalPoints(earnedPoints)
    setQuizState('correct')

    // Transition to complete state
    setTimeout(() => {
      setQuizState('complete')
      // Submit to API
      submitMutation.mutate(earnedPoints)
    }, 3000)
  }

  const handleClose = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    setQuizState('loading')
    onClose()
  }

  // Handle retry submission
  const handleRetry = () => {
    if (totalPoints > 0) {
      submitMutation.mutate(totalPoints)
    }
  }

  // Show already played message
  if (isCheckingActivity) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Memuat AR Quiz...</p>
        </div>
      </div>
    )
  }

  if (hasPlayedQuiz) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-primary to-orange-600 flex items-center justify-center z-[9999]">
        <div className="text-center text-white px-6 max-w-md">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold mb-4">
            Sudah Pernah Dimainkan
          </h1>
          <p className="text-white/80 mb-8">
            Anda sudah pernah memainkan AR Quiz ini sebelumnya. Setiap participant hanya dapat bermain satu kali.
          </p>
          <button
            onClick={handleClose}
            className="bg-white text-primary px-8 py-3 rounded-xl font-bold shadow-lg"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999]">
      <ZapparCanvas>
        <ZapparCamera
          userFacing={false}
          makeDefault
          rearCameraMirrorMode="none"
          ref={cameraRef}
        />

        <InstantTracker
          placementMode={!hasPlacedModel}
          placementCameraOffset={[0, 0, -5]}
          onUserClick={handlePlacement}
        >
          <Suspense fallback={null}>
            <ARScene
              onModelClick={handleModelClick}
              isInteractive={quizState === 'playing'}
            />
          </Suspense>
        </InstantTracker>
      </ZapparCanvas>

      {/* UI Overlay */}
      <ARQuizOverlay
        quizState={quizState}
        currentQuestion={currentQuestion || null}
        totalPoints={totalPoints}
        onClose={handleClose}
        onPlacement={handlePlacement}
        isSubmitting={submitMutation.isPending}
        submitError={submitMutation.error?.message || null}
        onRetry={handleRetry}
      />
    </div>
  )
}
