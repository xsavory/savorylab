import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import AdminLayout from 'src/components/admin-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedPageLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    const user = await context.adminAuth?.getUser()
    if (!user) {
      throw redirect({ to: '/' })
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