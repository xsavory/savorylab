import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import ParticipantLayout from 'src/components/participant-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_participant')({
  component: ParticipantPageLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context, location }) => {
    if (context.participantAuth?.user) {
      return
    }

    // Only call getUser if not cached
    const user = await context.participantAuth?.getUser()
    if (!user) {
      throw redirect({ to: '/', search: location.search })
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