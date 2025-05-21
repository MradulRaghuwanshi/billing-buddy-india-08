import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Plus, ScanBarcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Import our new components
import ScannerView from "./barcode/ScannerView";
import ManualBarcodeInput from "./barcode/ManualBarcodeInput";
import CameraErrorView from "./barcode/CameraErrorView";
import ProductDetailsForm from "./barcode/ProductDetailsForm";
import ScannedItemsList from "./barcode/ScannedItemsList";
import { ScannedProductInfo } from "./barcode/types";

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
  const [hasCamera, setHasCamera] = useState(true);
  const [isBarcodeInput, setIsBarcodeInput] = useState(false);
  const [scannedItems, setScannedItems] = useState<Product[]>([]);
  const [continuousScan, setContinuousScan] = useState(false);
  
  // State for scanned product info and form inputs
  const [scannedProductInfo, setScannedProductInfo] = useState<ScannedProductInfo | null>(null);
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsBarcodeInput(false);
      setScannedProductInfo(null);
      setCategory("");
      setQuantity("1");
      // Keep scanned items in case the user wants to add them later
    }
  }, [isOpen]);
  
  // Determine what to show when dialog opens
  useEffect(() => {
    if (isOpen && !scannedBarcode && !scannedProductInfo && !isBarcodeInput) {
      // Dialog opened without any existing barcode or manual input mode
      // The ScannerView component will start automatically
    }
  }, [isOpen, scannedBarcode, scannedProductInfo, isBarcodeInput]);

  // Process scanned barcode
  const handleBarcodeScanned = (barcode: string) => {
    // Find product with matching barcode
    const product = mockProducts.find(p => p.barcode === barcode);
    
    if (product) {
      setScannedProductInfo({
        barcode,
        name: product.name,
        price: product.price,
        expiryDate: product.expiryDate
      });
      
      toast({
        title: "Barcode detected successfully",
        description: `Product found: ${product.name}`,
      });
      
      if (onBarcodeDetected) {
        onBarcodeDetected(barcode);
      }
    } else {
      // If not found in our mock data, create simulated data
      const simulatedProduct = {
        barcode,
        name: `Product ${barcode.substring(0, 4)}`,
        price: Math.round(Math.random() * 1000) / 10,
        expiryDate: new Date(Date.now() + Math.random() * 31536000000).toISOString()
      };
      
      setScannedProductInfo(simulatedProduct);
      
      toast({
        title: "New product detected",
        description: `Add details for: ${simulatedProduct.name}`,
      });
      
      if (onBarcodeDetected) {
        onBarcodeDetected(barcode);
      }
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
      id: `prod_${uuidv4()}`,
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
      title: "Product added successfully",
      description: `${newProduct.name} has been added to your list.`,
    });
    
    // Reset for next scan
    setScannedProductInfo(null);
    setCategory("");
    setQuantity("1");
    
    // If continuous scan is enabled, start scanning again
    if (continuousScan) {
      setIsBarcodeInput(false); // Ensure we're in scanning mode
    }
  };

  // Handle restart scanning
  const handleRestartScan = () => {
    setScannedProductInfo(null);
    setIsBarcodeInput(false);
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
        title: "Items added successfully",
        description: `Added ${scannedItems.length} items to inventory.`,
      });
      setScannedItems([]);
      onOpenChange(false);
    }
  };

  const handleStartScanning = () => {
    // Camera access successful, ensure camera state is correct
    setHasCamera(true);
  };

  const handleStopScanning = () => {
    // Camera stopped, nothing special to do
  };

  const handleCameraError = () => {
    setHasCamera(false);
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
          {/* Choose which component to show based on the state */}
          {!isBarcodeInput && hasCamera && !scannedProductInfo && (
            <ScannerView 
              onBarcodeDetected={handleBarcodeScanned}
              onStartScanning={handleStartScanning}
              onStopScanning={handleStopScanning}
            />
          )}

          {/* Product info form */}
          {scannedProductInfo && (
            <ProductDetailsForm 
              scannedProductInfo={scannedProductInfo}
              category={category}
              setCategory={setCategory}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddProduct={handleAddProduct}
              onRestartScan={handleRestartScan}
            />
          )}
          
          {/* Manual input UI */}
          {isBarcodeInput && (
            <ManualBarcodeInput 
              onBarcodeDetected={handleBarcodeScanned}
              onCancel={() => setIsBarcodeInput(false)} 
            />
          )}
          
          {/* No camera fallback UI */}
          {!hasCamera && !isBarcodeInput && !scannedProductInfo && (
            <CameraErrorView 
              onRetry={() => setHasCamera(true)}
              onEnterManually={() => setIsBarcodeInput(true)}
            />
          )}
          
          {/* Scanned items list */}
          <ScannedItemsList 
            scannedItems={scannedItems}
            onClearAll={clearScannedItems}
            onRemoveItem={removeItem}
          />
          
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
          
          {!isBarcodeInput && !hasCamera && !scannedProductInfo && (
            <Button onClick={() => setHasCamera(true)} className="w-full sm:w-auto">
              <Camera className="mr-2 h-4 w-4" /> Access Camera
            </Button>
          )}
          
          <Button 
            onClick={() => {
              if (!scannedProductInfo) {
                setIsBarcodeInput(!isBarcodeInput);
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
