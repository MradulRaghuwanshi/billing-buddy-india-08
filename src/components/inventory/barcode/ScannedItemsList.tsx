
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Product } from "@/types";

interface ScannedItemsListProps {
  scannedItems: Product[];
  onClearAll: () => void;
  onRemoveItem: (productId: string) => void;
}

const ScannedItemsList = ({ scannedItems, onClearAll, onRemoveItem }: ScannedItemsListProps) => {
  if (scannedItems.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Scanned Items ({scannedItems.length})</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2" 
            onClick={onClearAll}
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
                onClick={() => onRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannedItemsList;
