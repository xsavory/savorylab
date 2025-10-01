import { Users, UserCheck, UserX } from "lucide-react";
import useParticipantStats from "src/hooks/use-participant-stats";

function AdminParticipantStats() {
  const { stats, isLoading, isError, error } = useParticipantStats();

  if (isError) {
    return (
      <div className="bg-red-900/20 border border-red-400/40 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-sm text-red-300">{error?.message || "Failed to load statistics"}</p>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Participants",
      value: stats?.total || 0,
      icon: Users,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-400/30",
    },
    {
      title: "Checked In",
      value: stats?.checkedIn || 0,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30",
    },
    {
      title: "Not Checked In",
      value: stats?.notCheckedIn || 0,
      icon: UserX,
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-400/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-lg p-6 transition-all hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-700/50 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-100">{stat.value}</p>
              )}
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminParticipantStats;
