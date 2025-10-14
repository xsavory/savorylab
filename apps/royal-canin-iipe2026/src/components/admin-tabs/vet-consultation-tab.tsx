import { useState, useEffect } from 'react'
import { Stethoscope, Dog, Cat, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Input } from '@repo/react-components/ui'

import { vetConsultationSchedule } from 'src/lib/api'
import type { Participant } from 'src/types/schema'

function VetConsultationTab() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['vet-consultation', 'stats'],
    queryFn: async () => {
      const response = await vetConsultationSchedule.getStats()
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  // Fetch consultations
  const { data: consultationsData, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ['vet-consultation', 'all', currentPage],
    queryFn: async () => {
      const response = await vetConsultationSchedule.getAll({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })

  useEffect(() => {
    const unsubscribe = vetConsultationSchedule.subscribe((payload) => {
      if (payload.events.includes('databases.*.tables.*.rows.*.create')) {
        queryClient.invalidateQueries({ queryKey: ['vet-consultation', 'stats'] });
        queryClient.invalidateQueries({ queryKey: ['vet-consultation', 'all', currentPage] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, currentPage]);

  // Filter consultations by search query (client-side)
  const filteredConsultations = consultationsData?.rows || []

  const totalPages = Math.ceil((consultationsData?.total || 0) / itemsPerPage)

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log('Export data')
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">
            Vet Consultation
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Manage veterinary consultation requests
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* Total Consultations */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Total Registrations
            </h3>
            <Stethoscope className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingStats ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-blue-600 font-display mb-2">
                {statsData?.totalConsultations?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-500">Consultations</p>
            </>
          )}
        </div>

        {/* Dog Consultations */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Dog Consultations
            </h3>
            <Dog className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingStats ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-orange-600 font-display mb-2">
                {statsData?.dogCount?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-500">Registrations</p>
            </>
          )}
        </div>

        {/* Cat Consultations */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Cat Consultations
            </h3>
            <Cat className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          </div>
          {isLoadingStats ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-4xl md:text-5xl font-black text-amber-600 font-display mb-2">
                {statsData?.catCount?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-500">Registrations</p>
            </>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header with Search and Export */}
        <div className="p-4 md:p-6 border-b border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-base md:text-lg font-bold text-foreground font-display">
              Consultation List
            </h3>
            <Button
              onClick={handleExport}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              disabled
              placeholder="Search by participant name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingConsultations ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-3 border-b border-gray-200">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No consultations found matching your search.' : 'No consultations yet.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Pet Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                    Pet Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider hidden md:table-cell">
                    Breed
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => {
                  const participant = typeof consultation.participants === 'string'
                    ? null
                    : (consultation.participants as Participant)

                  return (
                    <tr key={consultation.$id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {participant?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{consultation.petName}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {consultation.petType?.toLowerCase() === 'dog' ? (
                            <Dog className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Cat className="w-4 h-4 text-amber-600" />
                          )}
                          <span className="capitalize text-gray-900">{consultation.petType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{consultation.petBreed}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs hidden sm:table-cell">
                        {new Date(consultation.$createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoadingConsultations && filteredConsultations.length > 0 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, consultationsData?.total || 0)} of{' '}
              {consultationsData?.total || 0} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VetConsultationTab
