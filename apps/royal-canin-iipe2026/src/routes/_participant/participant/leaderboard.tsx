import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Loader2 } from 'lucide-react'
import { participants, QUERY_KEYS } from 'src/lib/api'

export const Route = createFileRoute('/_participant/participant/leaderboard')({
  component: ParticipantLeaderboard,
})

function ParticipantLeaderboard() {
  const { data, isLoading, isError } = useQuery({
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    queryKey: QUERY_KEYS.leaderboard,
    queryFn: async () => {
      const response = await participants.getLeaderboards()
      if (response.error) throw new Error(response.error || 'Failed to get data');
      return response.data
    },
  })

  const getRankStyle = (index: number) => {
    if (index === 0) {
      return {
        containerClass: 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-600',
        textColor: 'text-yellow-900',
        icon: Trophy,
        iconColor: 'text-yellow-700',
        label: '1st Place'
      }
    } else if (index === 1) {
      return {
        containerClass: 'bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-gray-500',
        textColor: 'text-gray-900',
        icon: Medal,
        iconColor: 'text-gray-700',
        label: '2nd Place'
      }
    } else if (index === 2) {
      return {
        containerClass: 'bg-gradient-to-br from-orange-300 to-orange-400 border-2 border-orange-500',
        textColor: 'text-orange-900',
        icon: Medal,
        iconColor: 'text-orange-700',
        label: '3rd Place'
      }
    } else {
      return {
        containerClass: 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300',
        textColor: 'text-gray-700',
        icon: Award,
        iconColor: 'text-gray-500',
        label: `${index + 1}th Place`
      }
    }
  }

  console.log(isLoading, '=====')

  if (isLoading) {
    return (
      <div className="min-h-full bg-gradient-to-b from-white to-primary/5 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat leaderboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-full bg-gradient-to-b from-white to-primary/5 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Oops!</h3>
          <p className="text-gray-500">Gagal memuat data leaderboard</p>
        </div>
      </div>
    )
  }

  const leaderboardData = data?.rows || []

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Top Participants
          </h1>
          <p className="text-gray-500 text-sm">5 peserta dengan poin tertinggi</p>
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          {(leaderboardData.length === 0 && !isLoading) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-500">Belum ada data leaderboard</p>
            </motion.div>
          ) : (
            leaderboardData.map((participant, index) => {
              const rankStyle = getRankStyle(index)
              const isTopThree = index < 3

              return (
                <motion.div
                  key={participant.$id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                  className={`relative ${isTopThree ? 'mb-6' : ''}`}
                >
                  <div
                    className={`bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-md relative overflow-hidden ${
                      index === 0 ? 'ring-2 ring-primary/30 scale-105' : ''
                    }`}
                    style={{
                      boxShadow: index === 0
                        ? '0 8px 0 0 rgba(234, 88, 12, 0.2), 0 12px 24px rgba(0, 0, 0, 0.1)'
                        : isTopThree
                        ? '0 4px 0 0 rgba(229, 231, 235, 0.8), 0 6px 16px rgba(0, 0, 0, 0.05)'
                        : '0 2px 0 0 rgba(229, 231, 235, 0.8)'
                    }}
                  >
                    {/* Top Badge for #1 */}
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                        TOP RANK
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          type: 'spring',
                          stiffness: 200
                        }}
                        className={`flex-shrink-0 ${
                          isTopThree ? 'w-14 h-14' : 'w-16 h-16'
                        } rounded-full flex items-center justify-center ${rankStyle.containerClass} shadow-lg relative`}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent"></div>
                        <div className="relative text-center">
                          <div className={`text-3xl font-black ${rankStyle.textColor}`}>
                            {index + 1}
                          </div>
                        </div>
                      </motion.div>

                      {/* Participant Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold truncate ${
                          index === 0 ? 'text-3xl text-primary' : isTopThree ? 'text-xl text-foreground' : 'text-lg text-foreground'
                        }`}>
                          {participant.name}
                        </h3>
                      </div>

                      {/* Points Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                        className={`flex-shrink-0 p-2 rounded-xl`}
                      >
                        <div className={`text-center ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                          <div className={`${isTopThree ? 'text-2xl' : 'text-xl'} font-black`}>
                            {participant.points}
                          </div>
                          <div className={`text-xs ${index === 0 ? 'text-primary' : 'text-gray-500'} font-semibold`}>
                            POIN
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Footer Info */}
        {leaderboardData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-xs text-gray-500"
          >
            <p>Leaderboard diperbarui secara real-time.</p>
            <p>Ikuti aktivitas untuk meningkatkan poin Anda!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
