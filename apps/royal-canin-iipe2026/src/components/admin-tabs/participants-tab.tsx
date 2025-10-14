import { Users } from 'lucide-react'

function ParticipantsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">
            Participants Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage and view all participant data
          </p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Participants Data
          </h3>
          <p className="text-sm text-gray-500">
            This section will display participant information, statistics, and management tools.
          </p>
          <div className="mt-6 inline-block bg-gray-50 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-600">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsTab
