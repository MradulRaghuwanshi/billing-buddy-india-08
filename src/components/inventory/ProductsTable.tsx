
import React from "react";
import { mockProducts } from "@/data/mockData";
import BarcodeDialog from "@/components/inventory/BarcodeDialog";
import AddProductDialog from "./AddProductDialog";
import FilterBar from "./filters/FilterBar";
import ProductsDataTable from "./table/ProductsDataTable";
import { useInventoryFilters } from "@/hooks/useInventoryFilters";
import { useProductManagement } from "@/hooks/useProductManagement";

const ProductsTable = () => {
  const {
    products,
    setProducts,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    activeFilter,
    sortOrder,
    toggleSortOrder,
    clearFilters
  } = useInventoryFilters(mockProducts);

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isBarcodeDialogOpen,
    setIsBarcodeDialogOpen,
    scannedBarcode,
    formData,
    setFormData,
    handleAddProduct,
    handleScanBarcode,
    handleMultipleItemsAdd
  } = useProductManagement(products, setProducts);

  return (
    <div className="space-y-4">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        clearFilters={clearFilters}
        setIsBarcodeDialogOpen={setIsBarcodeDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />

      <ProductsDataTable filteredProducts={filteredProducts} />

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
        onMultipleItemsAdd={handleMultipleItemsAdd}
      />
    </div>
  );
};

export default ProductsTable;
