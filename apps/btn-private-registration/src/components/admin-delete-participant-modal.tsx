import { useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@repo/react-components/ui";
import useDeleteParticipant from "src/hooks/use-delete-participant";
import type { Participant, AppwriteDocument } from "src/types/schema";

interface AdminDeleteParticipantModalProps {
  participant: AppwriteDocument<Participant>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AdminDeleteParticipantModal({
  participant,
  open,
  onOpenChange,
}: AdminDeleteParticipantModalProps) {
  const { deleteParticipant, isPending, isSuccess } = useDeleteParticipant();

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  const handleDelete = () => {
    deleteParticipant(participant.$id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-amber-400/30 backdrop-blur-sm text-gray-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-100">
              Delete Participant
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">
            Are you sure you want to delete <span className="font-semibold text-gray-100">{participant.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="bg-black/30 border-amber-400/30 text-gray-300 hover:bg-amber-500/20 hover:text-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminDeleteParticipantModal;
