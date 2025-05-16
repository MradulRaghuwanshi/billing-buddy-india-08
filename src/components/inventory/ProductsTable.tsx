
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
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { Search, Filter, Trash, Edit, Plus, Barcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
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
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showLowStock) {
      return matchesSearch && product.quantity < 20;
    }
    return matchesSearch;
  });

  const handleAddProduct = () => {
    const newProduct = {
      id: uuidv4(),
      name: formData.name,
      category: formData.category,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts([newProduct, ...products]);
    setIsAddDialogOpen(false);
    toast({
      title: "Product added",
      description: `${formData.name} has been added to inventory.`
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
      description: `Barcode ${randomBarcode} detected.`
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
        description: "Showing low stock items only."
      });
    } else {
      toast({
        title: "Filter removed",
        description: "Showing all inventory items."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            onClick={() => setIsBarcodeDialogOpen(true)}
          >
            <Barcode className="h-4 w-4" />
            Scan
          </Button>
          <Button 
            className="flex items-center gap-1"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell className="text-right">
                    ₹{product.price.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.quantity < 10
                          ? "text-red-500 font-medium"
                          : product.quantity < 20
                          ? "text-amber-500 font-medium"
                          : ""
                      }
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString('en-IN')
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
