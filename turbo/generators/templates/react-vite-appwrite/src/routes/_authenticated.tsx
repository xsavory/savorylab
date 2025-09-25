import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import AdminLayout from 'src/components/admin-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    if (!context.auth || context?.auth?.isLoading) {
      return;
    }

    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
})

function AuthenticatedLayout() {
  // This layout completely replaces the root layout for authenticated routes
  // The AdminLayout will handle its own navigation
  return (
    <div className="bg-background">
      <AdminLayout title="Dashboard" subtitle="Appwrite Template Admin">
        <Outlet />
      </AdminLayout>
    </div>
  )
}