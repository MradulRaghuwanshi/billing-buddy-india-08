
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const LowStockAlert = () => {
  const navigate = useNavigate();
  
  // Filter products with low stock (less than 20)
  const lowStockProducts = mockProducts.filter(
    (product) => product.quantity < 20
  ).slice(0, 5);

  const handleViewAllClick = () => {
    navigate("/inventory", { state: { filter: "lowStock" } });
  };

  return (
    <Card className="cursor-pointer" onClick={handleViewAllClick}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Low Stock Alerts</CardTitle>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {lowStockProducts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 border-amber-500 text-amber-500">
                      Low Stock
                    </Badge>
                    <span className="font-medium">{product.quantity} left</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-4 text-center">
            <p className="text-gray-500">No low stock items</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
