
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBills } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const RecentTransactions = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('recentTransactions')}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="divide-y divide-gray-200">
          {mockBills.map((bill) => (
            <li key={bill.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Bill #{bill.id}</p>
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <span>{new Date(bill.createdAt).toLocaleString('en-IN')}</span>
                    {bill.customerName && (
                      <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
                        {bill.customerName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{bill.total.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-500">{bill.items.length} {t('items')}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-4">
          <button className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t('viewAllTransactions')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
