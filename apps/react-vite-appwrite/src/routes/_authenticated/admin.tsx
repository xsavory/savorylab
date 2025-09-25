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
        <p className="text-muted-foreground mb-4">
          This is a protected route that requires authentication. You can access the Books demo and other features from here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">🔐 Authentication</h3>
            <p className="text-sm text-muted-foreground">Secure login with Appwrite</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">📚 Database Demo</h3>
            <p className="text-sm text-muted-foreground">CRUD operations with Books collection</p>
          </div>
        </div>
      </div>
    </div>
  )
}