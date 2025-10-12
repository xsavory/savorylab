import { RouterProvider, createRouter } from '@tanstack/react-router'

import useParticipantAuth from 'src/hooks/use-participant-auth'
import useAdminAuth from 'src/hooks/use-admin-auth'
import PageLoader from 'src/components/page-loader'

import { routeTree } from './routeTree.gen'

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    participantAuth: undefined,
    adminAuth: undefined
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadDelay: 100,
  defaultPendingComponent: PageLoader,
})

export default function AppRouter() {
  const participantAuth = useParticipantAuth()
  const adminAuth = useAdminAuth()

  const routeContext = { participantAuth, adminAuth }

  return (
    <RouterProvider router={router} context={routeContext} />
  )
}