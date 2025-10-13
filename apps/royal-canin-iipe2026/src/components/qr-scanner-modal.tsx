import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  QRCodeScanner,
} from "@repo/react-components/ui";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function extractRoutePath(url: string): { pathname: string, search: string } {
  const response = {
    pathname: '',
    search: ''
  }
  
  try {
    const urlObject = new URL(url);
    response.pathname = urlObject.pathname;
    response.search = urlObject.search
    
  } catch (error) {
    console.error('Invalid URL:', error);
  }

  return response
}

function QRScannerModal({ open, onOpenChange }: QRScannerModalProps) {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false);

  // Handler: QR Code scan
  const handleScan = useCallback((data: string) => {
    const { pathname: urlPathname, search: urlSearch } = extractRoutePath(data)
    const searchObj = new URLSearchParams(urlSearch)
    const searchResult = Object.fromEntries(searchObj)

    onOpenChange(false)
    navigate({ to: urlPathname, search: searchResult })
  }, [navigate, onOpenChange]);

  // Handler: Scanner error
  const handleScannerError = useCallback((error: string | Error) => {
    console.error("Scanner error:", error);
  }, []);

  // Handler: Scanning state change
  const handleScanningChange = useCallback((scanning: boolean) => {
    setIsScanning(scanning);
  }, []);

  // Handler: Idle timeout
  const handleIdleTimeout = useCallback(() => {
    console.info("⏱️ Scanner idle timeout - closing modal");
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <>
      {/* Scanner Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="font-bold flex items-center justify-between mr-6">
                <div className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-primary" />
                  QR Code Scanner
                </div>
                {/* Scanner Active Indicator */}
                {isScanning && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-green-600 text-sm font-medium">
                      Active
                    </span>
                  </div>
                )}
              </DialogTitle>
              <DialogDescription>Arahkan kamera ke QR code</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* QR Scanner Video */}
              <div className="relative bg-black rounded-lg overflow-hidden h-[500px]">
                <QRCodeScanner
                  open={open}
                  maxScansPerSecond={1}
                  onScan={handleScan}
                  onError={handleScannerError}
                  onScanningChange={handleScanningChange}
                  onIdleTimeout={handleIdleTimeout}
                />

                {/* Loading State */}
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">Loading camera...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QRScannerModal;
