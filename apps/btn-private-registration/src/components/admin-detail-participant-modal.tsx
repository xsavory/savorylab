import { useEffect, useRef, useState } from "react";
import { User, Download } from "lucide-react";
import QRCode from "qrcode";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Generate QR code when modal opens
  useEffect(() => {
    if (!open) {
      setQrGenerated(false);
      return;
    }

    const generateQR = async () => {
      // Wait for canvas to be mounted
      let retries = 0;
      while (!canvasRef.current && retries < 10) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        retries++;
      }

      if (!canvasRef.current) {
        console.error("Canvas element not available after retries");
        return;
      }

      try {
        const qrPayload = JSON.stringify({
          participantId: participant.$id,
          name: participant.name,
        });

        console.log("Generating QR with payload:", qrPayload);

        await QRCode.toCanvas(canvasRef.current, qrPayload, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });

        console.log("QR code generated successfully");
        setQrGenerated(true);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
        setQrGenerated(false);
      }
    };

    generateQR();
  }, [open, participant.$id, participant.name]);

  // Handle QR code download
  const handleDownloadQR = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      // Sanitize filename - replace special chars with underscore
      const sanitizedName = participant.name.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${sanitizedName}.png`;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    });
  };

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
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadQR}
              disabled={!qrGenerated}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
