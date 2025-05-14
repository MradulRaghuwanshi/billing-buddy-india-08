
import { Indian Rupee, Archive, ShoppingCart, ChartBar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import { useToast } from "@/components/ui/toast";

const Dashboard = () => {
  const { toast } = useToast();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Sales"
            value="₹12,500"
            icon={<Indian Rupee className="h-5 w-5 text-blue-600" />}
            trend="up"
            change={8}
          />
          <StatCard
            title="Total Products"
            value="124"
            icon={<Archive className="h-5 w-5 text-green-600" />}
            trend="up"
            change={12}
          />
          <StatCard
            title="Total Transactions"
            value="48"
            icon={<ShoppingCart className="h-5 w-5 text-amber-600" />}
            trend="down"
            change={3}
          />
          <StatCard
            title="Low Stock Items"
            value="5"
            icon={<ChartBar className="h-5 w-5 text-red-600" />}
          />
        </div>
        
        {/* Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SalesChart />
          <div className="lg:col-span-1 grid grid-cols-1 gap-6">
            <RecentTransactions />
            <LowStockAlert />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
