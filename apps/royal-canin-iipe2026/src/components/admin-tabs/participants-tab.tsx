import { useState, useEffect } from 'react'
import { Users, TrendingUp, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  Input,
  Button
} from '@repo/react-components/ui'

import { participants } from 'src/lib/api'

function ParticipantsTab() {
  const queryClient = useQueryClient();

  // Pagination & Search state
  const [page, setPage] = useState(1)
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const limit = 5

  // Fetch statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['participants', 'stats'],
    queryFn: async () => {
      const response = await participants.getStats()
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  // Fetch participants list
  const { data: participantsData, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ['participants', 'list', page, searchName, searchPhone],
    queryFn: async () => {
      const response = await participants.getAll({
        limit,
        offset: (page - 1) * limit,
        searchName: searchName || undefined,
        searchPhone: searchPhone || undefined,
      })
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  useEffect(() => {
    const unsubscribe = participants.subscribe((payload) => {
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        queryClient.invalidateQueries({ queryKey: ['participants', 'stats'] });
        queryClient.invalidateQueries({ queryKey: ['participants', 'list', page, searchName, searchPhone] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, page, searchName, searchPhone]);

  const totalPages = participantsData?.total ? Math.ceil(participantsData.total / limit) : 0

  const handleSearch = () => {
    setPage(1) // Reset to first page when searching
  }

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log('Export data')
  }

  const chartConfig = {
    count: {
      label: "Registrations",
      color: "#dc2626", // red-600
    },
  } satisfies ChartConfig

  return (
    <div className='space-y-3 mt-2'>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">
            Participants Management
          </h2>
          <p className="text-xs md:text-sm text-gray-600 ">
            Manage and view all participant data
          </p>
        </div>
      </div>

      {/* Main Content - 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:items-start">
        {/* Left Column - Stats Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Statistics
              </h3>
              <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
            </div>

            {/* Total Participants */}
            <div className="mb-4 pb-4 md:mb-18 md:pb-6 border-b border-gray-200">
              {isLoadingStats ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <p className="text-xs md:text-sm text-gray-500 mb-2">Total Participants</p>
                  <div className="text-4xl md:text-5xl font-black text-red-600 font-display">
                    {statsData?.totalParticipants?.toLocaleString() || 0}
                  </div>
                </>
              )}
            </div>

            {/* Daily Registrations Chart */}
            <div className="overflow-hidden">
              <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">Daily Registrations (10-15 Okt)</p>
              {isLoadingStats ? (
                <div className="animate-pulse h-40 md:h-48 bg-gray-200 rounded"></div>
              ) : statsData?.dailyRegistrations ? (
                <div className="w-full pr-2">
                  <ChartContainer config={chartConfig} className="h-40 md:h-48 w-full">
                    <BarChart
                      data={statsData.dailyRegistrations}
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
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="h-40 md:h-48 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-8 md:w-10 h-8 md:h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Table Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-full flex flex-col">
            {/* Table Header with Export CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-foreground font-display mb-1">
                  Participants List
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  View and manage all registered participants
                </p>
              </div>
              <Button
                onClick={handleExport}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 text-sm"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              {isLoadingParticipants ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 py-3 border-b border-gray-200">
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : participantsData?.rows && participantsData.rows.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider hidden sm:table-cell">
                        Phone
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                        Points
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider hidden md:table-cell">
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participantsData.rows.map((participant) => (
                      <tr key={participant.$id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{participant.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{participant.phone}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">
                          {participant.phone}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {participant.points || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs hidden md:table-cell">
                          {participant.$createdAt
                            ? new Date(participant.$createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No participants found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {participantsData && participantsData.total > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                <div className="text-xs md:text-sm text-gray-600">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, participantsData.total)} of {participantsData.total} participants
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs md:text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsTab
