
import React, { useState } from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// Get unique categories from mock products
const categories = [...new Set(mockProducts.map(p => p.category))];

interface FilterDropdownProps {
  activeFilter: string | null;
  clearFilters: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  activeFilter,
  clearFilters,
}) => {
  // Filter states
  const [localActiveFilter, setLocalActiveFilter] = useState<string | null>(activeFilter);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 100]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expiryFilter, setExpiryFilter] = useState<string | null>(null);

  const getMaxPrice = () => {
    return Math.max(...mockProducts.map(p => p.price), 1000);
  };

  const getMaxQuantity = () => {
    return Math.max(...mockProducts.map(p => p.quantity), 100);
  };

  return (
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
          onClick={() => setLocalActiveFilter(prev => prev === "lowStock" ? null : "lowStock")}
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
  );
};

export default FilterDropdown;
