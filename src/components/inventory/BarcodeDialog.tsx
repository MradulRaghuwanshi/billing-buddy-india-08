
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Barcode, RefreshCw, Plus, X, ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BarcodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scannedBarcode: string;
  handleScanBarcode: () => void;
  onBarcodeDetected?: (barcode: string) => void;
  onMultipleItemsAdd?: (products: Product[]) => void;
}

interface ScannedProductInfo {
  barcode: string;
  name: string;
  price: number;
  expiryDate?: string;
}

const categories = [
  "Grocery",
  "Dairy",
  "Beverages",
  "Snacks",
  "Personal Care",
  "Household",
  "Fruits & Vegetables",
  "Bakery",
  "Others"
];

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
  const [hasCamera, setHasCamera] = useState(true);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [isBarcodeInput, setIsBarcodeInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedItems, setScannedItems] = useState<Product[]>([]);
  const [continuousScan, setContinuousScan] = useState(false);
  
  // New state for scanned product info and form inputs
  const [scannedProductInfo, setScannedProductInfo] = useState<ScannedProductInfo | null>(null);
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  
  // Start video stream when dialog opens
  useEffect(() => {
    if (isOpen && !scannedBarcode && !scannedProductInfo && !isBarcodeInput) {
      startVideoStream();
    }
    
    // Cleanup function
    return () => {
      stopVideoStream();
    };
  }, [isOpen, scannedBarcode, scannedProductInfo, isBarcodeInput]);

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
              simulateBarcodeScanning();
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
    if (isCameraInitializing) return;
    
    setIsCameraInitializing(true);
    
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      // Reset hasCamera state before attempting to access
      setHasCamera(true);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
          }
        };
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
      toast({
        title: "Camera access failed",
        description: "Could not access camera. Make sure you've granted permission and are using a secure connection (HTTPS).",
      });
    } finally {
      setIsCameraInitializing(false);
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

  // Simulate barcode scanning (in a real app, use a proper barcode scanning library)
  const simulateBarcodeScanning = () => {
    if (Math.random() > 0.95) { // 5% chance to detect a barcode in this simulation
      // Generate a random barcode or use a predefined one
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      handleBarcodeScanned(randomProduct.barcode);
    }
  };

  // Process scanned barcode
  const handleBarcodeScanned = (barcode: string) => {
    stopVideoStream();
    
    // Find product with matching barcode or simulate product info retrieval
    const product = mockProducts.find(p => p.barcode === barcode);
    
    if (product) {
      // In a real application, we would fetch the product details from a database or API
      setScannedProductInfo({
        barcode,
        name: product.name,
        price: product.price,
        expiryDate: product.expiryDate
      });
      
      toast({
        title: "Barcode scanned successfully",
        description: `Product: ${product.name}`,
      });
      
      if (onBarcodeDetected) {
        onBarcodeDetected(barcode);
      }
    } else {
      // If not found in our mock data, create some simulated data
      const simulatedProduct = {
        barcode,
        name: `Product ${barcode.substring(0, 4)}`,
        price: Math.round(Math.random() * 1000) / 10,
        expiryDate: new Date(Date.now() + Math.random() * 31536000000).toISOString() // Random date within a year
      };
      
      setScannedProductInfo(simulatedProduct);
      
      toast({
        title: "Barcode scanned successfully",
        description: `Product: ${simulatedProduct.name}`,
      });
      
      if (onBarcodeDetected) {
        onBarcodeDetected(barcode);
      }
    }
  };

  // Handle manual barcode input
  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim().length >= 8) {
      handleBarcodeScanned(manualBarcode.trim());
    } else {
      toast({
        title: "Invalid barcode",
        description: "Please enter a valid barcode number",
      });
    }
  };

  // Handle form submission to add product with category and quantity
  const handleAddProduct = () => {
    if (!scannedProductInfo) return;
    
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for this product",
      });
      return;
    }
    
    if (!quantity || parseInt(quantity) < 1) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity",
      });
      return;
    }
    
    const newProduct: Product = {
      id: `prod_${scannedProductInfo.barcode}`,
      name: scannedProductInfo.name,
      barcode: scannedProductInfo.barcode,
      category: category,
      price: scannedProductInfo.price,
      quantity: parseInt(quantity),
      expiryDate: scannedProductInfo.expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to scanned items
    setScannedItems([...scannedItems, newProduct]);
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to your list.`,
    });
    
    // Reset for next scan
    setScannedProductInfo(null);
    setCategory("");
    setQuantity("1");
    
    // If continuous scan is enabled, start scanning again
    if (continuousScan) {
      startVideoStream();
    }
  };

  // Handle restart scanning
  const handleRestartScan = () => {
    setScannedProductInfo(null);
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
        description: `Added ${scannedItems.length} items to inventory.`,
      });
      setScannedItems([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Barcode Scanner</DialogTitle>
          <DialogDescription>
            Scan product barcodes to retrieve information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {/* Scanning UI */}
          {!isBarcodeInput && hasCamera && !scannedProductInfo && (
            <div className="relative w-full flex flex-col items-center">
              {isCameraInitializing ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Initializing camera...</p>
                </div>
              ) : (
                <>
                  <div className="relative rounded-lg overflow-hidden border-2 border-primary bg-black" style={{ width: "100%", height: "250px" }}>
                    <video 
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-red-500 w-64 h-16 opacity-70"></div>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Position barcode within the red box
                  </p>
                </>
              )}
            </div>
          )}
          
          {/* Product info form */}
          {scannedProductInfo && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-lg">Scanned Product Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Barcode:</span>
                  <span className="font-mono">{scannedProductInfo.barcode}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{scannedProductInfo.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Price:</span>
                  <span>₹{scannedProductInfo.price.toFixed(2)}</span>
                </div>
                
                {scannedProductInfo.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Expires:</span>
                    <span>{new Date(scannedProductInfo.expiryDate).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="col-span-3"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={handleRestartScan}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Scan Another
                </Button>
                <Button onClick={handleAddProduct}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </div>
            </div>
          )}
          
          {/* Manual input UI */}
          {isBarcodeInput && (
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
                <Button variant="outline" onClick={() => setIsBarcodeInput(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          {/* No camera fallback UI */}
          {!hasCamera && !isBarcodeInput && !scannedProductInfo && (
            <div className="flex flex-col items-center space-y-6 p-4">
              <ScanBarcode className="h-16 w-16 text-muted-foreground" />
              <div className="text-sm text-center space-y-4">
                <p className="text-muted-foreground">
                  Camera access not available or permission denied.
                </p>
                <p>Please check:</p>
                <ul className="list-disc text-left ml-4">
                  <li>You've granted camera permission in your browser</li>
                  <li>You're using a secure connection (HTTPS)</li>
                  <li>Your device has a working camera</li>
                </ul>
                <p className="pt-2">You can try again or enter barcode manually.</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => startVideoStream()}>
                  <Camera className="mr-2 h-4 w-4" /> Try Again
                </Button>
                <Button variant="outline" onClick={() => setIsBarcodeInput(true)}>
                  Enter Manually
                </Button>
              </div>
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
                        <div className="flex space-x-2 text-xs text-gray-500">
                          <span>₹{item.price}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
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
          
          {!isBarcodeInput && !isScanning && !scannedProductInfo && hasCamera && (
            <Button onClick={handleRestartScan} className="w-full sm:w-auto">
              <Camera className="mr-2 h-4 w-4" /> Access Camera
            </Button>
          )}
          
          {hasCamera && isScanning && !scannedProductInfo && (
            <Button onClick={() => stopVideoStream()} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset Scanner
            </Button>
          )}
          
          <Button 
            onClick={() => {
              if (!scannedProductInfo) {
                setIsBarcodeInput(!isBarcodeInput);
                if (isScanning) {
                  stopVideoStream();
                }
              }
            }} 
            variant={isBarcodeInput ? "default" : "outline"}
            className="w-full sm:w-auto"
            disabled={!!scannedProductInfo}
          >
            {isBarcodeInput ? "Cancel" : "Enter Manually"}
          </Button>
          
          <Button 
            onClick={handleScanBarcode} 
            className="w-full sm:w-auto"
            disabled={!!scannedProductInfo}
          >
            Simulate Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialog;
