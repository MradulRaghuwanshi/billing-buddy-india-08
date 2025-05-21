
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ManualBarcodeInputProps {
  onBarcodeDetected: (barcode: string) => void;
  onCancel: () => void;
}

const ManualBarcodeInput = ({ onBarcodeDetected, onCancel }: ManualBarcodeInputProps) => {
  const [manualBarcode, setManualBarcode] = useState("");
  const { toast } = useToast();

  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim().length >= 8) {
      onBarcodeDetected(manualBarcode.trim());
      setManualBarcode("");
    } else {
      toast({
        title: "Invalid barcode",
        description: "Please enter a valid barcode number (at least 8 digits)",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <Input
        type="text"
        className="w-full border-2 border-gray-300 rounded p-2 font-mono text-center"
        placeholder="Enter barcode manually"
        value={manualBarcode}
        onChange={(e) => setManualBarcode(e.target.value)}
        autoFocus
      />
      <div className="flex justify-center space-x-2">
        <Button onClick={handleManualBarcodeSubmit}>Submit</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default ManualBarcodeInput;
