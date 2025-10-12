import { createFileRoute } from '@tanstack/react-router'

import PageLoader from 'src/components/page-loader'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
  pendingComponent: PageLoader,
})

function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Welcome to the Admin Dashboard
        </h2>
      </div>
    </div>
  )
}