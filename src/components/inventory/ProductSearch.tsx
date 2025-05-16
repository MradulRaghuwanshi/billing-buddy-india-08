
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProductSearch = ({ searchTerm, setSearchTerm }: ProductSearchProps) => {
  return (
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
  );
};

export default ProductSearch;
