import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@repo/react-components/ui";

function ModalLoadingFallback() {
  return (
    <Dialog open={true}>
      <DialogContent className="bg-black/90 border-amber-400/30 backdrop-blur-sm">
        <DialogTitle className="sr-only">Loading</DialogTitle>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalLoadingFallback;
