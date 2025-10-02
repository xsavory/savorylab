import { useEffect, useRef, useState, useCallback } from "react";
import { QrCode, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/react-components/ui";
import useCreateAttendance from "src/hooks/use-create-attendance";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FeedbackState = {
  type: "success" | "error" | "loading" | null;
  message: string;
};

function QRScannerModal({ open, onOpenChange }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: "",
  });

  const { createAttendance, isPending, isSuccess, isError, error, data } =
    useCreateAttendance();

  // Auto-close modal after 10 seconds of idle
  const resetIdleTimer = useCallback(() => {
    // Clear existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Set new timer
    idleTimerRef.current = setTimeout(() => {
      console.info("⏱️ Scanner idle timeout - closing modal");
      onOpenChange(false);
    }, 7000); // 10 seconds
  }, [onOpenChange]);

  // Clear idle timer
  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  // Handle scan callback
  const handleScan = useCallback((result: { data: string }) => {
    const { data: qrData } = result;
    // Reset idle timer on scan activity
    resetIdleTimer();

    // Parse QR data
    try {
      const parsedData = JSON.parse(qrData);
      const participantId = parsedData.participantId || parsedData.id;

      if (!participantId) {
        console.info("⚠️ No participant ID in QR data");
        return;
      }

      // Clear idle timer and stop scanner before processing
      clearIdleTimer();
      if (scannerRef.current) {
        scannerRef.current.stop();
        setIsScanning(false);
      }

      // Close modal and trigger mutation
      onOpenChange(false);
      createAttendance(participantId);
    } catch (error) {
      console.info("⚠️ Invalid QR format, Error: ", error);
    }
  }, [createAttendance, onOpenChange, resetIdleTimer, clearIdleTimer]);

  // Handle mutation loading state
  useEffect(() => {
    if (isPending) {
      setFeedback({
        type: "loading",
        message: "Processing check-in...",
      });
    }
  }, [isPending]);

  // Handle mutation success
  useEffect(() => {
    if (isSuccess && data) {
      setFeedback({
        type: "success",
        message: `Check-in success!\nWelcome, ${data.participant.name}!`,
      });

      // Auto clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: null, message: "" });
      }, 3000);
    }
  }, [isSuccess, data]);

  // Handle mutation error
  useEffect(() => {
    if (isError && error) {
      const errorMessage = error.message || "Check-in gagal";

      setFeedback({
        type: "error",
        message: errorMessage,
      });

      // Auto clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: null, message: "" });
      }, 3000);
    }
  }, [isError, error]);

  // Initialize scanner when modal opens
  useEffect(() => {
    if (!open) {
      clearIdleTimer(); // Clear timer when modal closes
      return;
    }

    let scanner: QrScanner | null = null;
    let mounted = true;

    const initScanner = async () => {
      // Wait for video element to be ready
      let retries = 0;
      while (!videoRef.current && retries < 10 && mounted) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        retries++;
      }

      if (!videoRef.current || !mounted) {
        console.info("Video element not available or component unmounted");
        return;
      }

      try {
        console.info("📷 Initializing QR scanner...");
        const video = videoRef.current;

        scanner = new QrScanner(
          video,
          handleScan,
          {
            returnDetailedScanResult: true,
            preferredCamera: "environment",
            maxScansPerSecond: 5,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = scanner;

        await scanner.start();
        console.info("✅ Scanner started successfully");
        setIsScanning(true);

        // Start idle timer when scanner is ready
        resetIdleTimer();
      } catch (error) {
        console.error("❌ Scanner error:", error);
        setFeedback({
          type: "error",
          message: "Gagal mengakses kamera",
        });
      }
    };

    initScanner();

    // Cleanup
    return () => {
      mounted = false;
      console.info("🔌 Cleaning up scanner...");
      clearIdleTimer();
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
      scannerRef.current = null;
      setIsScanning(false);
    };
  }, [open, handleScan, resetIdleTimer, clearIdleTimer]);

  return (
    <>
      {/* Scanner Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gradient-to-br from-slate-800/95 via-gray-800/95 to-slate-900/95 border-amber-400/40 backdrop-blur-md max-w-3xl shadow-2xl shadow-amber-500/10 [&>button]:text-gray-100 [&>button]:hover:text-amber-400">
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/10 via-transparent to-amber-400/5 blur-2xl pointer-events-none -z-10"></div>
          <div className="relative">
            <DialogHeader className="border-b border-amber-400/20 pb-4">
              <DialogTitle className="text-gray-100 text-2xl font-bold flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-amber-400" />
                  QR Code Scanner
                </div>
                {/* Scanner Active Indicator */}
                {isScanning && (
                  <div className="flex items-center gap-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm mr-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">
                      Scanner active
                    </span>
                  </div>
                )}
              </DialogTitle>
              <DialogDescription>Arahkan kamera ke QR code peserta</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* QR Scanner Video */}
              <div className="relative bg-black rounded-lg overflow-hidden h-[500px]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Loading State */}
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-gray-400 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">Loading camera...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      {feedback.type && (
        <Dialog open={!!feedback.type} onOpenChange={() => setFeedback({ type: null, message: "" })}>
          <DialogContent className="bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-black/95 border-amber-400/50 backdrop-blur-xl max-w-md shadow-2xl shadow-amber-500/20 [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="sr-only">
                {feedback.type === "loading" && "Processing Check-in"}
                {feedback.type === "success" && "Check-in Successful"}
                {feedback.type === "error" && "Check-in Failed"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {feedback.message}
              </DialogDescription>
            </DialogHeader>

            <div className="py-12 px-6">
              <div className="flex flex-col items-center justify-center space-y-6">
                {feedback.type === "loading" && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"></div>
                      <Loader2 className="w-24 h-24 text-amber-400 animate-spin relative" />
                    </div>
                    <p className="text-amber-300 text-lg font-semibold text-center">
                      {feedback.message}
                    </p>
                  </>
                )}

                {feedback.type === "success" && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-full animate-pulse"></div>
                      <CheckCircle2 className="w-28 h-28 text-green-400 relative drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                    </div>
                    <div className="text-center space-y-2">
                      {feedback.message.split('\n').map((line, index) => (
                        <p
                          key={index}
                          className={index === 0
                            ? "text-green-300 text-2xl font-bold"
                            : "text-gray-100 text-xl font-medium"
                          }
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </>
                )}

                {feedback.type === "error" && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-400/20 blur-xl rounded-full"></div>
                      <XCircle className="w-24 h-24 text-red-400 relative drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                    </div>
                    <p className="text-red-300 text-lg font-semibold text-center">
                      {feedback.message}
                    </p>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default QRScannerModal;
