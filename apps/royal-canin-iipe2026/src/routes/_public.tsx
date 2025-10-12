import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'

import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_public')({
  pendingMs: 300,
  component: PublicLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    const user = await context.participantAuth?.getUser()
    if (user) {
      throw redirect({ to: '/participant' })
    }
  }
})

function PublicLayout() {
  return (
    <main>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </main>
  )
}