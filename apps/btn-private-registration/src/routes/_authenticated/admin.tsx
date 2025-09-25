import { createFileRoute } from '@tanstack/react-router'

import AdminLayout from 'src/components/admin-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
  pendingComponent: PageLoader,
})

function AdminPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to the Admin Dashboard
        </h1>
      </div>
    </AdminLayout>
  )
}