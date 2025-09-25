import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated')({
  component: () => <Outlet />,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
})