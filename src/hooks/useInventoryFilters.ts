
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

export const useInventoryFilters = (initialProducts: Product[]) => {
  const { state } = useLocation();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 100]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expiryFilter, setExpiryFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  // Check if we should show low stock items from navigation state
  useEffect(() => {
    if (state?.filter === "lowStock") {
      setActiveFilter("lowStock");
    }
  }, [state]);

  // Sort products alphabetically by default (ascending)
  useEffect(() => {
    const sortedProducts = [...initialProducts].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setProducts(sortedProducts);
  }, [initialProducts]);

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

  return {
    products,
    setProducts,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    priceRange,
    setPriceRange,
    quantityRange,
    setQuantityRange,
    categoryFilter,
    setCategoryFilter,
    expiryFilter,
    setExpiryFilter,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    clearFilters
  };
};
