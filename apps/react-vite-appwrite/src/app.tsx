import { useEffect } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import useAuth from 'src/hooks/use-auth'
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
    auth: undefined
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadDelay: 100,
  defaultPendingComponent: PageLoader,
})

export default function AppRouter() {
  const auth = useAuth();

  useEffect(() => {
    router.invalidate(); // Re-run beforeLoad checks
  }, [auth.isAuthenticated, auth.user?.id, auth.isLoading]);

  if (auth.isLoading) {
    return <PageLoader />
  }

  return (
    <RouterProvider router={router} context={{ auth }} />
  )
}