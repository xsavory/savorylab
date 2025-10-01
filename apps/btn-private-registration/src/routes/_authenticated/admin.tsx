import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import AdminLayout from 'src/components/admin-layout'
import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
  pendingComponent: PageLoader,
})

// Lazy load components
const AdminExportData = React.lazy(() => import('src/components/admin-export-data'))
const ParticipantStats = React.lazy(() => import('src/components/admin-participant-stats'))
const ParticipantManagement = React.lazy(() => import('src/components/admin-participant-management'))
const AdminContentLoading = React.lazy(() => import('src/components/admin-content-loading'))

function AdminPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto mb-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Manage participants and monitor event statistics
            </p>
          </div>

          {/* Export Button */}
          <React.Suspense fallback={<AdminContentLoading />}>
            <AdminExportData />
          </React.Suspense>
        </div>

        {/* Stats Section */}
        <React.Suspense fallback={<AdminContentLoading />}>
          <ParticipantStats />
        </React.Suspense>

        {/* Management Section */}
        <React.Suspense fallback={<AdminContentLoading />}>
          <div className="mt-6">
            <ParticipantManagement />
          </div>
        </React.Suspense>
      </div>
    </AdminLayout>
  )
}
