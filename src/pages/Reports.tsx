
import Layout from "@/components/layout/Layout";
import SalesReportChart from "@/components/reports/SalesReportChart";
import InventoryStatusChart from "@/components/reports/InventoryStatusChart";
import { useLanguage } from "@/contexts/LanguageContext";

const Reports = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('reportsAnalytics')}</h1>
          <p className="text-gray-500">{t('trackPerformance')}</p>
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
