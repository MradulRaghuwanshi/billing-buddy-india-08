
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Edit, Trash } from "lucide-react";

interface ProductsDataTableProps {
  filteredProducts: Product[];
}

export const ProductsDataTable: React.FC<ProductsDataTableProps> = ({ filteredProducts }) => {
  return (
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
  );
};

export default ProductsDataTable;
