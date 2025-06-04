
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailySales } from "@/data/mockData";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const SalesChart = () => {
  const [data, setData] = useState(dailySales);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Format the data for the chart
    const formattedData = dailySales.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    }));
    
    // Only show the last 14 days
    setData(formattedData.slice(-14));
  }, []);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t('salesOverview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
                activeDot={{ r: 8 }}
                name="Sales Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
