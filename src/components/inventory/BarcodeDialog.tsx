
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Barcode, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scannedBarcode: string;
  handleScanBarcode: () => void;
  onBarcodeDetected?: (barcode: string) => void;
}

const BarcodeDialog = ({
  isOpen,
  onOpenChange,
  scannedBarcode,
  handleScanBarcode,
  onBarcodeDetected,
}: BarcodeDialogProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isBarcodeInput, setIsBarcodeInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  // Start video stream when dialog opens
  useEffect(() => {
    if (isOpen && !scannedBarcode) {
      startVideoStream();
    }
    
    return () => {
      stopVideoStream();
    };
  }, [isOpen, scannedBarcode]);

  // Initialize barcode detection
  useEffect(() => {
    let interval: number;
    
    if (isScanning && videoRef.current && canvasRef.current) {
      interval = window.setInterval(() => {
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.height = video.videoHeight;
              canvas.width = video.videoWidth;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // In a real implementation, we would use a barcode scanning library here
              // For now, we'll simulate detection after a few seconds of scanning
              simulateBarcodeDetection();
            }
          }
        } catch (error) {
          console.error("Error during barcode scanning:", error);
        }
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);

  // Start camera stream
  const startVideoStream = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setHasCamera(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
      toast({
        title: "Camera access failed",
        description: "Could not access camera. Make sure you've granted permission.",
      });
    }
  };

  // Stop video stream
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Simulate barcode detection (in a real app, use a proper barcode scanning library)
  const simulateBarcodeDetection = () => {
    if (Math.random() > 0.95) { // 5% chance to detect a barcode in this simulation
      const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      handleBarcodeDetected(randomBarcode);
    }
  };

  // Process detected barcode
  const handleBarcodeDetected = (barcode: string) => {
    stopVideoStream();
    if (onBarcodeDetected) {
      onBarcodeDetected(barcode);
    }
  };

  // Handle manual barcode input
  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim().length >= 8) {
      handleBarcodeDetected(manualBarcode.trim());
    } else {
      toast({
        title: "Invalid barcode",
        description: "Please enter a valid barcode number",
      });
    }
  };

  // Handle restart scanning
  const handleRestartScan = () => {
    startVideoStream();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {scannedBarcode ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-64 h-16 border-2 border-gray-300 flex items-center justify-center">
                <p className="font-mono text-lg">{scannedBarcode}</p>
              </div>
              <p className="text-sm text-muted-foreground">Barcode detected</p>
            </div>
          ) : isBarcodeInput ? (
            <div className="w-full space-y-4">
              <input
                type="text"
                className="w-full border-2 border-gray-300 rounded p-2 font-mono text-center"
                placeholder="Enter barcode manually"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                autoFocus
              />
              <div className="flex justify-center space-x-2">
                <Button onClick={handleManualBarcodeSubmit}>Submit</Button>
                <Button variant="outline" onClick={() => setIsBarcodeInput(false)}>Cancel</Button>
              </div>
            </div>
          ) : hasCamera ? (
            <div className="relative w-full flex flex-col items-center">
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-300" style={{ width: "280px", height: "210px" }}>
                <video 
                  ref={videoRef}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary w-64 h-16 opacity-50"></div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Position barcode within the box
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <Barcode className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Camera access not available.<br />Enter barcode manually or try again.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          {!scannedBarcode && (
            <>
              {!isBarcodeInput && !isScanning && (
                <Button onClick={handleRestartScan} className="w-full sm:w-auto">
                  <Camera className="mr-2 h-4 w-4" /> Access Camera
                </Button>
              )}
              {hasCamera && isScanning && (
                <Button onClick={() => stopVideoStream()} variant="outline" className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset Scanner
                </Button>
              )}
              <Button 
                onClick={() => setIsBarcodeInput(!isBarcodeInput)} 
                variant={isBarcodeInput ? "default" : "outline"}
                className="w-full sm:w-auto"
              >
                {isBarcodeInput ? "Cancel" : "Enter Manually"}
              </Button>
              <Button onClick={handleScanBarcode} className="w-full sm:w-auto">
                Simulate Scan
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialog;
