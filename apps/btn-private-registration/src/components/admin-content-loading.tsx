import { Loader2 } from "lucide-react";

function AdminContentLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Loading Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-black/30 border border-amber-400/20 backdrop-blur-sm rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                <div className="h-8 w-16 bg-gray-700/50 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Loading */}
      <div className="bg-black/30 border border-amber-400/20 backdrop-blur-sm rounded-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400 mb-4" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    </div>
  );
}

export default AdminContentLoading;
