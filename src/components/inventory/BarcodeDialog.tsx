
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react";

interface BarcodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scannedBarcode: string;
  handleScanBarcode: () => void;
}

const BarcodeDialog = ({
  isOpen,
  onOpenChange,
  scannedBarcode,
  handleScanBarcode,
}: BarcodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          {scannedBarcode ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-64 h-16 border-2 border-gray-300 flex items-center justify-center">
                <p className="font-mono text-lg">{scannedBarcode}</p>
              </div>
              <p className="text-sm text-muted-foreground">Barcode detected</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <Barcode className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Point your device's camera at a barcode<br />or click the button below to simulate scanning.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleScanBarcode} disabled={!!scannedBarcode}>
            {scannedBarcode ? "Processing..." : "Simulate Scan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialog;
