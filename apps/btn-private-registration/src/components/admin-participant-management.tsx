import { useState, useMemo, lazy, Suspense } from "react";
import { Plus, Search, Filter, X } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/react-components/ui";

import AdminParticipantTable from "./admin-participant-table";
import ModalLoadingFallback from "./modal-loading-fallback";

// Lazy load create modal
const CreateParticipantModal = lazy(() => import("./admin-create-edit-participant-modal"));

function AdminParticipantManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = () => {
    setSearchName(searchInput);
    setOffset(0); // Reset to first page when searching
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchName("");
    setOffset(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setOffset(0); // Reset to first page when filtering
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const isCheckedInFilter = useMemo(() => {
    return statusFilter === "all" ? undefined : statusFilter === "checked-in";
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="bg-black/30 border border-amber-400/20 rounded-lg backdrop-blur-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search and Filter */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-10 pr-10 bg-black/20 border-amber-400/30 text-gray-100 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20"
              />
              {(searchInput || searchName) && (
                <button
                  onClick={handleResetSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-black/20 border-amber-400/30 text-gray-100 focus:border-amber-400 focus:ring-amber-400/20">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-amber-400/30 backdrop-blur-sm">
                <SelectItem
                  value="all"
                  className="text-gray-300 hover:text-gray-100 hover:bg-amber-500/20"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="checked-in"
                  className="text-gray-300 hover:text-gray-100 hover:bg-amber-500/20"
                >
                  Checked In
                </SelectItem>
                <SelectItem
                  value="not-checked-in"
                  className="text-gray-300 hover:text-gray-100 hover:bg-amber-500/20"
                >
                  Not Checked In
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
        </div>
      </div>

      {/* Table */}
      <AdminParticipantTable
        searchName={searchName}
        isCheckedIn={isCheckedInFilter}
        limit={limit}
        offset={offset}
        onPageChange={handlePageChange}
      />

      {/* Create Modal */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {isCreateModalOpen && (
          <CreateParticipantModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          />
        )}
      </Suspense>
    </div>
  );
}

export default AdminParticipantManagement;
