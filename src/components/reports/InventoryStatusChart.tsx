
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";

const InventoryStatusChart = () => {
  // Categorize products by stock status
  const lowStock = mockProducts.filter(p => p.quantity < 10).length;
  const mediumStock = mockProducts.filter(p => p.quantity >= 10 && p.quantity < 30).length;
  const goodStock = mockProducts.filter(p => p.quantity >= 30).length;
  
  const data = [
    { name: "Low Stock", value: lowStock, color: "#EF4444" },
    { name: "Medium Stock", value: mediumStock, color: "#F59E0B" },
    { name: "Good Stock", value: goodStock, color: "#10B981" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Products']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatusChart;
