import { useState, useCallback } from "react";
import { User, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  QRCodeGenerator,
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
  const [qrGenerated, setQrGenerated] = useState(false);
  const [downloadQR, setDownloadQR] = useState<((options: { fileName: string }) => void) | null>(null);

  const participantQRData = {
    participantId: participant.$id,
    name: participant.name,
  }

  // Handler: QR code generated
  const handleQRGenerated = useCallback((success: boolean) => {
    setQrGenerated(success);
    if (success) {
      console.log("QR code generated successfully");
    } else {
      console.error("Failed to generate QR code");
    }
  }, []);

  // Handler: QR code ready (expose download method)
  const handleQRReady = useCallback((methods: { download: (options: { fileName: string }) => void }) => {
    setDownloadQR(() => methods.download);
  }, []);

  // Handler: Download QR code
  const handleDownloadClick = useCallback(() => {
    if (!downloadQR) return;

    // Sanitize filename - replace special chars with underscore
    const sanitizedName = participant.name.replace(/[^a-zA-Z0-9]/g, "_");
    downloadQR({ fileName: sanitizedName });
  }, [downloadQR, participant.name]);

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

        <div className="space-y-6">
          {/* Participant Info - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-100">{participant.name}</p>
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

            {/* Checked In At */}
            {participant.isCheckedIn && participant.checkedInAt && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-400">Checked In At</p>
                <p className="text-sm text-gray-100">
                  {new Date(participant.checkedInAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div className="space-y-3 pt-2 border-t border-amber-400/20">
            <p className="text-sm text-gray-400">QR Code</p>

            {/* QR Canvas Preview */}
            <QRCodeGenerator
              data={participantQRData}
              onGenerated={handleQRGenerated}
              onReady={handleQRReady}
              className="flex justify-center"
            />

            {/* Download Button */}
            <Button
              onClick={handleDownloadClick}
              disabled={!qrGenerated}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminDetailParticipantModal;
