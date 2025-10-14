import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/react-components/ui'
import { Users, Activity, Stethoscope, Loader2 } from 'lucide-react'

import PageLoader from 'src/components/page-loader'

// Lazy load tab components
const ParticipantsTab = lazy(() => import('src/components/admin-tabs/participants-tab'))
const ActivityTab = lazy(() => import('src/components/admin-tabs/activity-tab'))
const VetConsultationTab = lazy(() => import('src/components/admin-tabs/vet-consultation-tab'))

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
  pendingComponent: PageLoader,
})

// Loading component for lazy loaded tabs
function TabLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="participants" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Participants</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="vet-consultation" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span>Vet Consultation</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents with Suspense for lazy loading */}
        <TabsContent value="participants">
          <Suspense fallback={<TabLoader />}>
            <ParticipantsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="activity">
          <Suspense fallback={<TabLoader />}>
            <ActivityTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="vet-consultation">
          <Suspense fallback={<TabLoader />}>
            <VetConsultationTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}