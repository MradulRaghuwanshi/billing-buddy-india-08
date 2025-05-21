
import { useState } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export const useProductManagement = (initialProducts: Product[], updateProducts: (products: Product[]) => void) => {
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

    // Add the new product
    const updatedProducts = [newProduct, ...initialProducts];
    updateProducts(updatedProducts);
    
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

  const handleMultipleItemsAdd = (products: Product[]) => {
    // In a real application, this would update the inventory in the database
    toast({
      title: "Products added to inventory",
      description: `${products.length} products have been added successfully.`
    });
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isBarcodeDialogOpen,
    setIsBarcodeDialogOpen,
    scannedBarcode,
    setScannedBarcode,
    formData,
    setFormData,
    handleAddProduct,
    handleScanBarcode,
    handleMultipleItemsAdd
  };
};
