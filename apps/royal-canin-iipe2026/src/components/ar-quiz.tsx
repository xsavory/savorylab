import { motion } from 'framer-motion'
import { Scan, PlayCircle } from 'lucide-react'

function ARQuiz() {
  const handleEnterAR = () => {
    console.log('Opening AR Experience...')
    // TODO: Implement AR frame opening logic
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-primary font-display">
          AR Quiz Experience
        </h2>
        <p className="text-gray-500 text-sm">
          Masuki dunia interaktif dan jawab quiz dalam AR
        </p>
      </motion.div>

      {/* AR Preview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-red-600 via-orange-600 to-red-500 rounded-2xl p-8 mb-6 relative overflow-hidden"
      >
        <div className="relative z-10 text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Scan className="w-20 h-20 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-white mb-2">
            Quiz Interaktif 3D
          </h3>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={handleEnterAR}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-5 px-6 rounded-xl relative overflow-hidden group shadow-lg"
        style={{
          boxShadow: '0 4px 0 0 rgba(234, 88, 12, 0.7), 0 8px 16px rgba(234, 88, 12, 0.3)'
        }}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
          }}
        />

        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10 flex items-center justify-center gap-3">
          <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg">Enter AR Experience</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Scan className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.button>

      {/* Info text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-500 mt-4"
      >
        📱 Pastikan kamera Anda aktif untuk pengalaman AR terbaik
      </motion.p>
    </div>
  )
}

export default ARQuiz
