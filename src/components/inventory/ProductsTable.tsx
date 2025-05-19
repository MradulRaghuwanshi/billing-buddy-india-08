
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
import { Search, FilterX, Trash, Edit, Plus, Barcode, ArrowDownAZ } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import AddProductDialog from "./AddProductDialog";
import BarcodeDialog from "./BarcodeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const ProductsTable = () => {
  const { state } = useLocation();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtering states
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 100]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expiryFilter, setExpiryFilter] = useState<string | null>(null);
  
  // Sort state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { toast } = useToast();

  // Get unique categories for filter
  const categories = [...new Set(mockProducts.map(p => p.category))];

  // Check if we should show low stock items from navigation state
  useEffect(() => {
    if (state?.filter === "lowStock") {
      setActiveFilter("lowStock");
    }
  }, [state]);

  // Sort products alphabetically by default (ascending)
  useEffect(() => {
    const sortedProducts = [...mockProducts].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setProducts(sortedProducts);
  }, []);

  // Apply all filters and sorting
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Active filters
    const matchesActiveFilter = activeFilter === "lowStock" 
      ? product.quantity < 20 
      : true;
    
    // Price filter
    const matchesPriceFilter = 
      product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Quantity filter
    const matchesQuantityFilter = 
      product.quantity >= quantityRange[0] && product.quantity <= quantityRange[1];
    
    // Category filter
    const matchesCategoryFilter = categoryFilter 
      ? product.category === categoryFilter 
      : true;
    
    // Expiry filter
    const matchesExpiryFilter = expiryFilter
      ? expiryFilter === "expired" 
        ? new Date(product.expiryDate) <= new Date() 
        : expiryFilter === "thisMonth"
        ? isExpiringThisMonth(product.expiryDate)
        : expiryFilter === "nextMonth"
        ? isExpiringNextMonth(product.expiryDate)
        : true
      : true;
    
    return matchesSearch && 
           matchesActiveFilter && 
           matchesPriceFilter && 
           matchesQuantityFilter && 
           matchesCategoryFilter && 
           matchesExpiryFilter;
  }).sort((a, b) => {
    return sortOrder === "asc" 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name);
  });

  const isExpiringThisMonth = (date: string) => {
    if (!date) return false;
    const today = new Date();
    const expiryDate = new Date(date);
    return expiryDate.getMonth() === today.getMonth() && 
           expiryDate.getFullYear() === today.getFullYear();
  };

  const isExpiringNextMonth = (date: string) => {
    if (!date) return false;
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
    const expiryDate = new Date(date);
    return expiryDate.getMonth() === nextMonth.getMonth() && 
           expiryDate.getFullYear() === nextMonth.getFullYear();
  };

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

    // Add the new product and re-sort
    const updatedProducts = [newProduct, ...products];
    const sortedProducts = [...updatedProducts].sort((a, b) => {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
    
    setProducts(sortedProducts);
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

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    
    toast({
      title: `Sort order: ${newSortOrder === "asc" ? "A to Z" : "Z to A"}`,
      description: "Product list has been re-sorted."
    });
  };

  const clearFilters = () => {
    setActiveFilter(null);
    setPriceRange([0, 10000]);
    setQuantityRange([0, 100]);
    setCategoryFilter(null);
    setExpiryFilter(null);
    
    toast({
      title: "Filters cleared",
      description: "Showing all inventory items."
    });
  };

  const getMaxPrice = () => {
    return Math.max(...products.map(p => p.price), 1000);
  };

  const getMaxQuantity = () => {
    return Math.max(...products.map(p => p.quantity), 100);
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
            variant="outline" 
            className="flex items-center gap-1"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4 rotate-180" />}
            {sortOrder === "asc" ? "A to Z" : "Z to A"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={activeFilter ? "default" : "outline"}
                className="flex items-center gap-1"
              >
                {activeFilter ? <FilterX className="h-4 w-4" /> : <FilterX className="h-4 w-4" />}
                {activeFilter ? "Filtered" : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Products</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className={activeFilter === "lowStock" ? "bg-accent" : ""}
                onClick={() => setActiveFilter(prev => prev === "lowStock" ? null : "lowStock")}
              >
                Low Stock
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <div className="px-2 py-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Price Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Price Range</h4>
                      <Slider
                        defaultValue={[0, getMaxPrice()]}
                        max={getMaxPrice()}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="px-2 py-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Quantity Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Quantity Range</h4>
                      <Slider
                        defaultValue={[0, getMaxQuantity()]}
                        max={getMaxQuantity()}
                        step={1}
                        value={quantityRange}
                        onValueChange={(value) => setQuantityRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{quantityRange[0]} items</span>
                        <span>{quantityRange[1]} items</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="px-2 py-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Category
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Select Category</h4>
                      <RadioGroup 
                        value={categoryFilter || ""} 
                        onValueChange={(value) => setCategoryFilter(value || null)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="cat-all" />
                          <Label htmlFor="cat-all">All Categories</Label>
                        </div>
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <RadioGroupItem value={category} id={`cat-${category}`} />
                            <Label htmlFor={`cat-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="px-2 py-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Expiry Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Filter by Expiry</h4>
                      <RadioGroup 
                        value={expiryFilter || ""} 
                        onValueChange={(value) => setExpiryFilter(value || null)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="exp-all" />
                          <Label htmlFor="exp-all">All Products</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expired" id="exp-expired" />
                          <Label htmlFor="exp-expired">Expired Products</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="thisMonth" id="exp-this-month" />
                          <Label htmlFor="exp-this-month">Expiring This Month</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nextMonth" id="exp-next-month" />
                          <Label htmlFor="exp-next-month">Expiring Next Month</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
