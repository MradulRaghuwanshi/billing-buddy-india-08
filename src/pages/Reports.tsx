
import Layout from "@/components/layout/Layout";
import SalesReportChart from "@/components/reports/SalesReportChart";
import InventoryStatusChart from "@/components/reports/InventoryStatusChart";

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">Track your business performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesReportChart />
          <InventoryStatusChart />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
