import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import Navbar from 'src/components/navbar'

interface MyRouterContext {
  sample: string
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  ),
})