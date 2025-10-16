import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Trophy, Loader2 } from 'lucide-react'
import type { ARQuizState, ARQuizQuestion } from 'src/types/ar'

interface ARQuizOverlayProps {
  quizState: ARQuizState
  currentQuestion: ARQuizQuestion | null
  totalPoints: number
  onClose: () => void
  isSubmitting: boolean
  submitError: string | null
  onRetry?: () => void
  onPlacement?: () => void
}

export default function ARQuizOverlay({
  quizState,
  currentQuestion,
  totalPoints,
  onClose,
  isSubmitting,
  submitError,
  onRetry,
  onPlacement,
}: ARQuizOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      {/* Close Button - Always visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg pointer-events-auto z-[10001]"
      >
        <X className="w-6 h-6 text-gray-800" />
      </motion.button>

      {/* Loading State */}
      <AnimatePresence>
        {quizState === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white">
              <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
              <p className="text-xl font-bold">Loading AR Experience...</p>
              <p className="text-sm text-white/70 mt-2">Please wait</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro State */}
      <AnimatePresence>
        {quizState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white px-6 max-w-md">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <Target className="w-24 h-24 mx-auto text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">AR Quiz Ready!</h1>
              <p className="text-lg mb-2">Arahkan kamera ke lantai atau permukaan datar</p>
              <p className="text-sm text-white/70">Tap pada layar untuk menempatkan model 3D</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placing State */}
      <AnimatePresence>
        {quizState === 'placing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 pb-safe"
          >
            <div 
              onClick={onPlacement}
              className="bg-gradient-to-t from-black/80 to-transparent px-6 py-8 text-center text-white pointer-events-auto">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 border-4 border-primary rounded-full flex items-center justify-center"
              >
                <Target className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-lg font-semibold">Tap untuk menempatkan</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing State - Question Box */}
      <AnimatePresence>
        {quizState === 'playing' && currentQuestion && (
          <>
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-20 left-4 right-4 pointer-events-auto"
            >
              <div className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wide">
                      Question {currentQuestion.id}
                    </div>
                    <p className="text-white text-lg font-bold leading-snug">
                      {currentQuestion.question}
                    </p>
                  </div>
                  <div className="text-center bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <div className="text-white text-2xl font-black">
                      {currentQuestion.points}
                    </div>
                    <div className="text-white/80 text-xs font-semibold">
                      pts
                    </div>
                  </div>
                </div>
                {currentQuestion.hint && (
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/90 text-sm">
                      💡 {currentQuestion.hint}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Instruction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-4 right-4 pointer-events-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 text-center shadow-lg">
                <p className="text-gray-800 font-semibold">
                  👆 Tap kucing untuk menjawab!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Correct State */}
      <AnimatePresence>
        {quizState === 'correct' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/50"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-7xl mb-4"
              >
                ✅
              </motion.div>
              <h2 className="text-3xl font-black text-green-600 mb-3">
                Benar!
              </h2>
              <div className="bg-primary/10 rounded-xl p-4 mb-4">
                <div className="text-5xl font-black text-primary mb-1">
                  +{currentQuestion.points}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  POIN
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentQuestion.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete State */}
      <AnimatePresence>
        {quizState === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-primary via-orange-600 to-red-600 flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white px-6 max-w-md">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Trophy className="w-24 h-24 mx-auto mb-6" />
              </motion.div>

              <h1 className="text-4xl font-black mb-4">
                Quiz Selesai!
              </h1>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="text-7xl font-black mb-2">
                  {totalPoints}
                </div>
                <div className="text-xl font-semibold">
                  TOTAL POIN
                </div>
              </div>

              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan hasil...</span>
                </div>
              )}

              {submitError && (
                <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <p className="text-sm mb-3">❌ {submitError}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              )}

              {!isSubmitting && !submitError && (
                <p className="text-white/80">
                  ✅ Poin berhasil disimpan!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
