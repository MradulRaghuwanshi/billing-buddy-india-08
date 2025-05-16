
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { Search, Filter, Trash, Edit, Plus, Barcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import ProductSearch from "./ProductSearch";
import ProductActions from "./ProductActions";
import ProductsTableContent from "./ProductsTableContent";
import AddProductDialog from "./AddProductDialog";
import BarcodeDialog from "./BarcodeDialog";

const ProductsTable = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    barcode: "",
    price: "",
    quantity: "",
    expiryDate: ""
  });

  const { toast } = useToast();

  // Check if we should show low stock items from navigation state
  useEffect(() => {
    if (state?.filter === "lowStock") {
      setShowLowStock(true);
    }
  }, [state]);

  // Filter products based on search term and low stock filter
  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
        
      if (showLowStock) {
        return matchesSearch && product.quantity < 20;
      }
      return matchesSearch;
    }
  );

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: uuidv4(),
      name: formData.name,
      category: formData.category,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts([newProduct, ...products]);
    setIsAddDialogOpen(false);
    toast({
      title: "Product added",
      description: `${formData.name} has been added to inventory.`,
    });
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      barcode: "",
      price: "",
      quantity: "",
      expiryDate: ""
    });
  };

  const handleScanBarcode = () => {
    // Simulate barcode scanning
    const randomBarcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    setScannedBarcode(randomBarcode);
    
    // In a real app, this would connect to a barcode scanner API
    toast({
      title: "Barcode scanned",
      description: `Barcode ${randomBarcode} detected.`,
    });
    
    setTimeout(() => {
      setIsBarcodeDialogOpen(false);
      // Pre-fill the add product form with the barcode
      setFormData({
        ...formData,
        barcode: randomBarcode
      });
      setIsAddDialogOpen(true);
    }, 1500);
  };

  const toggleLowStockFilter = () => {
    setShowLowStock(!showLowStock);
    if (!showLowStock) {
      toast({
        title: "Filter applied",
        description: "Showing low stock items only.",
      });
    } else {
      toast({
        title: "Filter removed",
        description: "Showing all inventory items.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <ProductSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ProductActions 
          showLowStock={showLowStock}
          toggleLowStockFilter={toggleLowStockFilter}
          openBarcodeDialog={() => setIsBarcodeDialogOpen(true)}
          openAddDialog={() => setIsAddDialogOpen(true)}
        />
      </div>

      <ProductsTableContent filteredProducts={filteredProducts} />

      <AddProductDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        handleAddProduct={handleAddProduct}
      />

      <BarcodeDialog
        isOpen={isBarcodeDialogOpen}
        onOpenChange={setIsBarcodeDialogOpen}
        scannedBarcode={scannedBarcode}
        handleScanBarcode={handleScanBarcode}
      />
    </div>
  );
};

export default ProductsTable;
