import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import AdminLayout from 'src/components/admin-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated')({
  pendingMs: 100,
  component: AuthenticatedPageLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    if (context.adminAuth?.user) {
      return
    }

    const user = await context.adminAuth?.getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
})

function AuthenticatedPageLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}