import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Toaster } from '@repo/react-components/ui'

import type { ParticipantAuthContextType } from 'src/contexts/participant-auth-context'
import type { AdminAuthContextType } from 'src/contexts/admin-auth-context'

interface MyRouterContext {
  participantAuth: ParticipantAuthContextType | undefined,
  adminAuth: AdminAuthContextType | undefined
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  ),
})
