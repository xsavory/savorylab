import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@repo/react-components/ui";
import type { Participant, AppwriteDocument } from "src/types/schema";

interface AdminDetailParticipantModalProps {
  participant: AppwriteDocument<Participant>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AdminDetailParticipantModal({
  participant,
  open,
  onOpenChange,
}: AdminDetailParticipantModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-amber-400/30 backdrop-blur-sm text-gray-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-amber-500/20">
              <User className="h-6 w-6 text-amber-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-100">
              Participant Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-lg font-medium text-gray-100">{participant.name}</p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Status</p>
            <div>
              {participant.isCheckedIn ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                  Checked In
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-500/20 text-slate-300 border border-slate-400/30">
                  Not Checked In
                </span>
              )}
            </div>
          </div>

          {/* More details will be added later */}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminDetailParticipantModal;
