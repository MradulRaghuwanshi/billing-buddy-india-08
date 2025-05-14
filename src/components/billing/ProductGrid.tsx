import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { BillItem, Product } from "@/types";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductGridProps {
  addToCart: (product: BillItem) => void;
}

const ProductGrid = ({ addToCart }: ProductGridProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = [...new Set(mockProducts.map((product) => product.category))];

  // Filter products
  const filteredProducts = mockProducts.filter(
    (product) =>
      (currentCategory === null || product.category === currentCategory) &&
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (product: Product) => {
    const billItem: BillItem = {
      ...product,
      quantityInBill: 1,
      discount: 0,
      total: product.price
    };
    
    addToCart(billItem);
    toast({
      title: "Added to bill",
      description: `${product.name} has been added to the bill.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by name or barcode"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Input type="text" placeholder="Scan barcode..." className="flex-1" />
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2">
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => setCurrentCategory(null)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            className="whitespace-nowrap"
            onClick={() => setCurrentCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAddToCart(product)}
          >
            <div className="text-left">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <p className="font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                <span
                  className={`text-sm font-medium ${
                    product.quantity < 10
                      ? "text-red-500"
                      : product.quantity < 20
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                >
                  {product.quantity} in stock
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
