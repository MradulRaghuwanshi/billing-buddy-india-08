
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FilterX, Barcode, ArrowDownAZ } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { useToast } from "@/hooks/use-toast";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeFilter: string | null;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  clearFilters: () => void;
  setIsBarcodeDialogOpen: (value: boolean) => void;
  setIsAddDialogOpen: (value: boolean) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  sortOrder,
  toggleSortOrder,
  clearFilters,
  setIsBarcodeDialogOpen,
  setIsAddDialogOpen,
}) => {
  return (
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

        <FilterDropdown 
          activeFilter={activeFilter} 
          clearFilters={clearFilters} 
        />
        
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
          <Search className="h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
