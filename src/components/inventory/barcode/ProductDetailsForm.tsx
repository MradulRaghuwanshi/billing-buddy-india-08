
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus } from "lucide-react";
import { ScannedProductInfo } from "./types";

interface ProductDetailsFormProps {
  scannedProductInfo: ScannedProductInfo;
  category: string;
  setCategory: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  onAddProduct: () => void;
  onRestartScan: () => void;
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

const ProductDetailsForm = ({
  scannedProductInfo,
  category,
  setCategory,
  quantity,
  setQuantity,
  onAddProduct,
  onRestartScan
}: ProductDetailsFormProps) => {
  return (
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
        <Button variant="outline" onClick={onRestartScan}>
          <RefreshCw className="mr-2 h-4 w-4" /> Scan Another
        </Button>
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsForm;
