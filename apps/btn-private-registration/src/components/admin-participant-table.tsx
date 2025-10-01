import { useState, lazy, Suspense } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/react-components/ui";

import useParticipants from "src/hooks/use-participants";
import type { Participant, AppwriteDocument } from "src/types/schema";

import ModalLoadingFallback from "./modal-loading-fallback";

// Lazy load modals
const DetailParticipantModal = lazy(() => import("./admin-detail-participant-modal"));
const UpdateParticipantModal = lazy(() => import("./admin-create-edit-participant-modal"));
const DeleteParticipantModal = lazy(() => import("./admin-delete-participant-modal"));

interface AdminParticipantTableProps {
  searchName?: string;
  isCheckedIn?: boolean;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

function AdminParticipantTable({
  searchName,
  isCheckedIn,
  limit,
  offset,
  onPageChange,
}: AdminParticipantTableProps) {
  const { participants, total, isLoading, isError, error } = useParticipants({
    limit,
    offset,
    searchName,
    isCheckedIn,
  });

  const [selectedParticipant, setSelectedParticipant] = useState<AppwriteDocument<Participant> | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<AppwriteDocument<Participant>>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-100">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "isCheckedIn",
      header: "Status",
      cell: ({ row }) => (
        <div>
          {row.original.isCheckedIn ? (
            <Badge className="rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
              Checked In
            </Badge>
          ) : (
            <Badge className="rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-400/30">
              Not Checked In
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "checkedInAt",
      header: "Checked In At",
      cell: ({ row }) => {
        if (!row.original.checkedInAt) {
          return <div className="text-gray-500">-</div>;
        }

        const date = new Date(row.original.checkedInAt);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div className="text-gray-400">
            <div>{formattedDate}</div>
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 text-gray-400 hover:text-gray-100 hover:bg-amber-500/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-black/90 border-amber-400/30 backdrop-blur-sm"
          >
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original);
                setIsDetailModalOpen(true);
              }}
              className="text-gray-300 hover:text-gray-100 hover:bg-amber-500/20 cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original);
                setIsUpdateModalOpen(true);
              }}
              className="text-gray-300 hover:text-gray-100 hover:bg-amber-500/20 cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-300 hover:text-red-100 hover:bg-red-500/20 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: participants || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
  });

  if (isError) {
    return (
      <div className="bg-red-900/20 border border-red-400/40 rounded-lg p-4 backdrop-blur-sm">
        <p className="text-sm text-red-300">{error?.message || "Failed to load participants"}</p>
      </div>
    );
  }

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-black/30 border border-amber-400/20 rounded-lg backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-500/10 border-b border-amber-400/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-amber-400/10">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                      <span className="ml-2 text-gray-400">Loading participants...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <p className="text-gray-400">No participants found</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-amber-500/5 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-400">
            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} participants
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(offset - limit)}
              disabled={currentPage === 1 || isLoading}
              className="bg-black/30 border-amber-400/30 text-gray-300 hover:bg-amber-500/20 hover:text-gray-100 disabled:opacity-50"
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(offset + limit)}
              disabled={currentPage === totalPages || isLoading}
              className="bg-black/30 border-amber-400/30 text-gray-300 hover:bg-amber-500/20 hover:text-gray-100 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {isDetailModalOpen && selectedParticipant && (
          <DetailParticipantModal
            participant={selectedParticipant}
            open={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
          />
        )}
      </Suspense>

      <Suspense fallback={<ModalLoadingFallback />}>
        {isUpdateModalOpen && selectedParticipant && (
          <UpdateParticipantModal
            participant={selectedParticipant}
            open={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
          />
        )}
      </Suspense>

      <Suspense fallback={<ModalLoadingFallback />}>
        {isDeleteModalOpen && selectedParticipant && (
          <DeleteParticipantModal
            participant={selectedParticipant}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          />
        )}
      </Suspense>
    </div>
  );
}

export default AdminParticipantTable;
