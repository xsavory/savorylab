import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import ParticipantRegisterModal from 'src/components/participant-register-modal'

import royalCaninLogo from 'src/assets/royal-canin-logo.png'
import landingImage from 'src/assets/landing-image.png'
import iipeLogo from 'src/assets/iipe-logo.jpg'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12
    }
  }
}

const headlineVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  }
}

function Index() {
  const headline1 = "HEALTH IS"
  const headline2 = "WORTH IT"

  return (
    <div className="relative h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 overflow-hidden">
      <motion.img
        src={iipeLogo}
        alt='iipe-logo'
        className='absolute top-8 left-6 max-w-[10rem] md:max-w-[12rem] z-10'
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
      />
      <motion.img
        src={landingImage}
        alt='landing-image'
        className='absolute -bottom-8 -right-16 max-w-[240px] grayscale'
        initial={{ x: 100, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.4 }}
      />

      {/* Animated Top-right accent */}
      <motion.div
        className="absolute top-[-6rem] right-[-5rem] w-[12rem] h-[14rem] md:w-[20rem] md:h-[20rem] rounded-[3rem] bg-primary"
        initial={{ rotate: 25, scale: 0 }}
        animate={{ rotate: 25, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Animated Bottom-left accent */}
      <motion.div
        className="absolute bottom-[-12rem] left-[-6rem] w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] rounded-[4rem] bg-primary"
        initial={{ rotate: -15, scale: 0 }}
        animate={{ rotate: -15, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.15 }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>

      {/* Main Content */}
      <section className="relative container px-4 py-8 mx-auto md:py-16 h-full w-full">
        <motion.div
          className="flex flex-col items-center justify-center h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div className="mb-2" variants={itemVariants}>
            <motion.img
              src={royalCaninLogo}
              alt="Royal Canin Logo"
              className="w-32 md:w-52 lg:w-56"
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>

          {/* Event Headline */}
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-7xl font-black tracking-tight font-display text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]"
              variants={headlineVariants}
            >
              {headline1}
            </motion.h1>
            <motion.h2
              className="text-6xl md:text-7xl font-black tracking-tight font-display text-primary drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]"
              variants={headlineVariants}
            >
              {headline2}
            </motion.h2>
            <motion.p
              className="text-base md:text-2xl text-gray-400 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Because Every Pet is Unique
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            className="flex flex-col items-center w-full mt-4 mb-12 md:mt-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
          >
            <ParticipantRegisterModal />
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
