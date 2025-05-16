
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Barcode, Plus } from "lucide-react";

interface ProductActionsProps {
  showLowStock: boolean;
  toggleLowStockFilter: () => void;
  openBarcodeDialog: () => void;
  openAddDialog: () => void;
}

const ProductActions = ({ 
  showLowStock, 
  toggleLowStockFilter, 
  openBarcodeDialog, 
  openAddDialog 
}: ProductActionsProps) => {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Button 
        variant={showLowStock ? "default" : "outline"}
        className="flex items-center gap-1"
        onClick={toggleLowStockFilter}
      >
        <Filter className="h-4 w-4" />
        {showLowStock ? "Clear Filter" : "Low Stock"}
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-1"
        onClick={openBarcodeDialog}
      >
        <Barcode className="h-4 w-4" />
        Scan
      </Button>
      <Button 
        className="flex items-center gap-1"
        onClick={openAddDialog}
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
};

export default ProductActions;
