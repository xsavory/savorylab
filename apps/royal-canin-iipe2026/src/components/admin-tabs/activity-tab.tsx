import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Clock, Users } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  Button
} from '@repo/react-components/ui'

import { participants, activityLog } from 'src/lib/api'

function ActivityTab() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Fetch leaderboard
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['participants', 'leaderboard'],
    queryFn: async () => {
      const response = await participants.getLeaderboards()
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  // Fetch activity stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['activity', 'stats', selectedDate],
    queryFn: async () => {
      const response = await activityLog.getStats({
        date: selectedDate || undefined
      })
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  useEffect(() => {
    const unsubscribe = activityLog.subscribe((payload) => {
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        queryClient.invalidateQueries({ queryKey: ['activity', 'stats', selectedDate] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, selectedDate]);

  useEffect(() => {
    const unsubscribe = participants.subscribe((payload) => {
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        queryClient.invalidateQueries({ queryKey: ['participants', 'leaderboard'] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  // Chart configs
  const trendChartConfig = {
    vetEdu: {
      label: "Vet Education Quiz",
      color: "#dc2626", // red-600
    },
    sustainability: {
      label: "Sustainability Quiz",
      color: "#16a34a", // green-600
    },
  } satisfies ChartConfig

  const hourlyChartConfig = {
    vetEdu: {
      label: "Vet Education Quiz",
      color: "#dc2626",
    },
    sustainability: {
      label: "Sustainability Quiz",
      color: "#16a34a",
    },
  } satisfies ChartConfig

  // Get available dates from trend data for date filter
  const availableDates = statsData?.activityTrend?.map(item => ({
    value: item.date,
    label: item.displayDate
  })) || []

  return (
    <div className="space-y-3 mt-2">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">
            Activity Tracking
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Monitor participant activities and engagement
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Top 3 Leaderboard */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Top 3 Players
            </h3>
            <Users className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingLeaderboard ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : leaderboardData?.rows && leaderboardData.rows.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.rows.slice(0, 3).map((participant, index) => (
                <div key={participant.$id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">{participant.name}</p>
                    <p className="text-xs text-gray-500">{participant.points || 0} points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
          )}
        </div>

        {/* Vet Education Quiz Participants */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Vet Education Quiz
            </h3>
            <Activity className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingStats ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-red-600 font-display mb-2">
                {statsData?.vetEduParticipantsCount?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-500">Participants</p>
            </>
          )}
        </div>

        {/* Sustainability Quiz Participants */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Sustainability Quiz
            </h3>
            <Activity className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingStats ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-green-600 font-display mb-2">
                {statsData?.sustainabilityParticipantsCount?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-500">Participants</p>
            </>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Activity Trend Comparison Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm md:text-base font-bold text-foreground font-display mb-1">
                Activity Trend Comparison
              </h3>
              <p className="text-xs text-gray-500">Daily activity comparison</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          {isLoadingStats ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : statsData?.activityTrend && statsData.activityTrend.length > 0 ? (
            <div className="overflow-hidden">
              <div className="w-full pr-2">
                <ChartContainer config={trendChartConfig} className="h-64 w-full">
                  <LineChart
                    data={statsData.activityTrend}
                    margin={{ top: 10, right: 5, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="displayDate"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      width={25}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="vetEdu"
                      stroke="var(--color-vetEdu)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Vet Education"
                    />
                    <Line
                      type="monotone"
                      dataKey="sustainability"
                      stroke="var(--color-sustainability)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Sustainability"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Hourly Activity Pattern Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-foreground font-display mb-1">
                  Hourly Activity Pattern
                </h3>
                <p className="text-xs text-gray-500">When activities are played</p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedDate === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDate('')}
                className="text-xs h-7"
              >
                All Dates
              </Button>
              {availableDates.map((date) => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDate(date.value)}
                  className="text-xs h-7"
                >
                  {date.label}
                </Button>
              ))}
            </div>
          </div>

          {isLoadingStats ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : statsData?.hourlyPattern ? (
            <div className="overflow-hidden">
              <div className="w-full pr-2">
                <ChartContainer config={hourlyChartConfig} className="h-64 w-full">
                  <BarChart
                    data={statsData.hourlyPattern}
                    margin={{ top: 10, right: 5, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="displayHour"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9 }}
                      interval={2}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      width={25}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar
                      dataKey="vetEdu"
                      fill="var(--color-vetEdu)"
                      radius={[4, 4, 0, 0]}
                      name="Vet Education"
                    />
                    <Bar
                      dataKey="sustainability"
                      fill="var(--color-sustainability)"
                      radius={[4, 4, 0, 0]}
                      name="Sustainability"
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity data yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityTab
