
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  handleScanBarcode 
}: BarcodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center mb-4">
            {scannedBarcode ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Barcode detected</p>
                <p className="text-xl font-mono">{scannedBarcode}</p>
              </div>
            ) : (
              <Barcode className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <Button onClick={handleScanBarcode}>
            {scannedBarcode ? "Scan Again" : "Simulate Scan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialog;
