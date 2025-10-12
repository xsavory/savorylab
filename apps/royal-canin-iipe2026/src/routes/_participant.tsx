import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import ParticipantLayout from 'src/components/participant-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_participant')({
  component: ParticipantPageLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    if (context.participantAuth?.user) {
      return
    }

    // Only call getUser if not cached
    const user = await context.participantAuth?.getUser()
    if (!user) {
      throw redirect({ to: '/' })
    }
  }
})

function ParticipantPageLayout() {
  return (
    <ParticipantLayout>
      <Outlet />
    </ParticipantLayout>
  )
}