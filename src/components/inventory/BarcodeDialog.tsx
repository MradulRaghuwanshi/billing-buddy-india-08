
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Barcode, RefreshCw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";

interface BarcodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scannedBarcode: string;
  handleScanBarcode: () => void;
  onBarcodeDetected?: (barcode: string) => void;
  onMultipleItemsAdd?: (products: Product[]) => void;
}

const BarcodeDialog = ({
  isOpen,
  onOpenChange,
  scannedBarcode,
  handleScanBarcode,
  onBarcodeDetected,
  onMultipleItemsAdd,
}: BarcodeDialogProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isBarcodeInput, setIsBarcodeInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedItems, setScannedItems] = useState<Product[]>([]);
  const [continuousScan, setContinuousScan] = useState(false);

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
      // Ensure we don't scan products that are already in the list
      const availableProducts = mockProducts.filter(
        product => !scannedItems.some(item => item.id === product.id)
      );
      
      if (availableProducts.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      const randomProduct = availableProducts[randomIndex];
      handleBarcodeDetected(randomProduct.barcode);
    }
  };

  // Process detected barcode
  const handleBarcodeDetected = (barcode: string) => {
    if (!continuousScan) {
      stopVideoStream();
    }
    
    // Find product with matching barcode
    const product = mockProducts.find(p => p.barcode === barcode);
    
    if (product) {
      // Only add if not already in the list
      if (!scannedItems.some(item => item.id === product.id)) {
        setScannedItems([...scannedItems, product]);
      }
      
      toast({
        title: "Product scanned",
        description: `${product.name} has been added to your list.`,
      });
      
      if (onBarcodeDetected) {
        onBarcodeDetected(barcode);
      }
      
      // If not in continuous scan mode, prepare for next scan
      if (!continuousScan) {
        setManualBarcode("");
      } else {
        // Start scanning again
        startVideoStream();
      }
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode ${barcode}`,
      });
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
  
  // Clear all scanned items
  const clearScannedItems = () => {
    setScannedItems([]);
  };
  
  // Remove a single item
  const removeItem = (productId: string) => {
    setScannedItems(scannedItems.filter(item => item.id !== productId));
  };
  
  // Add all scanned items
  const handleAddAllItems = () => {
    if (onMultipleItemsAdd && scannedItems.length > 0) {
      onMultipleItemsAdd(scannedItems);
      toast({
        title: "Items added",
        description: `Added ${scannedItems.length} items to cart.`,
      });
      setScannedItems([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {/* Scanning UI */}
          {!isBarcodeInput && hasCamera && !scannedBarcode && (
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
          )}
          
          {/* Manual input UI */}
          {isBarcodeInput && (
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
          )}
          
          {/* No camera fallback UI */}
          {!hasCamera && !isBarcodeInput && !scannedBarcode && (
            <div className="flex flex-col items-center space-y-6">
              <Barcode className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Camera access not available.<br />Enter barcode manually or try again.
              </p>
            </div>
          )}
          
          {/* Scanned items list */}
          {scannedItems.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Scanned Items ({scannedItems.length})</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={clearScannedItems}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {scannedItems.map(item => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-2 border rounded-md"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Continuous scan toggle */}
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="continuous-scan" 
              checked={continuousScan} 
              onChange={() => setContinuousScan(!continuousScan)} 
              className="rounded border-gray-300"
            />
            <label htmlFor="continuous-scan" className="text-sm">
              Enable continuous scanning mode
            </label>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          {scannedItems.length > 0 && (
            <Button onClick={handleAddAllItems} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> 
              Add {scannedItems.length} {scannedItems.length === 1 ? 'Item' : 'Items'}
            </Button>
          )}
          
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialog;
