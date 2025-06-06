
import { IndianRupee, Archive, ShoppingCart, ChartBar, Package } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Filter low stock products
  const lowStockProducts = mockProducts.filter((product) => product.quantity < 20);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        </div>

        {/* Low Stock Items Quick View */}
        <Card className="border border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 text-amber-600 mr-2" />
                {t('lowStockItems')}
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/inventory">{t('viewAllInventory')}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.slice(0, 6).map((product) => (
                  <div 
                    key={product.id} 
                    className="p-3 border rounded-md flex justify-between items-center bg-white"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        product.quantity < 10 ? "text-red-500" : "text-amber-500"
                      }`}>
                        {product.quantity} {t('leftInStock')}
                      </p>
                      <p className="text-sm">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">{t('noLowStockItems')}</p>
            )}
          </CardContent>
        </Card>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('todaysSales')}
            value="₹12,500"
            icon={<IndianRupee className="h-5 w-5 text-blue-600" />}
            trend="up"
            change={8}
          />
          <StatCard
            title={t('totalProducts')}
            value="124"
            icon={<Archive className="h-5 w-5 text-green-600" />}
            trend="up"
            change={12}
          />
          <StatCard
            title={t('totalTransactions')}
            value="48"
            icon={<ShoppingCart className="h-5 w-5 text-amber-600" />}
            trend="down"
            change={3}
          />
          <StatCard
            title={t('lowStockItems')}
            value={lowStockProducts.length.toString()}
            icon={<ChartBar className="h-5 w-5 text-red-600" />}
          />
        </div>
        
        {/* Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SalesChart />
          <div className="lg:col-span-1 grid grid-cols-1 gap-6">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
