import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { AuthContextType } from 'src/contexts/auth-context'

interface MyRouterContext {
  auth: AuthContextType | undefined,
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  ),
})
