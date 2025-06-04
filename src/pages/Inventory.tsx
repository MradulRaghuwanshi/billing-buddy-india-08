
import Layout from "@/components/layout/Layout";
import ProductsTable from "@/components/inventory/ProductsTable";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { useState } from "react";
import BarcodeDialog from "@/components/inventory/BarcodeDialog";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Inventory = () => {
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleScanBarcode = () => {
    // Simulate barcode scanning
    const randomBarcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    setScannedBarcode(randomBarcode);
    
    toast({
      title: t('barcodeScanned'),
      description: t('barcodeDetected').replace('{{barcode}}', randomBarcode)
    });
  };

  const handleMultipleItemsAdd = (products: Product[]) => {
    // In a real application, this would update the inventory in the database
    toast({
      title: t('productsAddedToInventory'),
      description: t('productsAddedSuccessfully').replace('{{count}}', products.length.toString())
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('inventoryManagement')}</h1>
            <p className="text-gray-500">{t('manageProducts')}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setIsBarcodeDialogOpen(true)}
            >
              <ScanBarcode className="h-4 w-4" />
              {t('scanBarcode')}
            </Button>
          </div>
        </div>

        <ProductsTable />

        <BarcodeDialog
          isOpen={isBarcodeDialogOpen}
          onOpenChange={setIsBarcodeDialogOpen}
          scannedBarcode={scannedBarcode}
          handleScanBarcode={handleScanBarcode}
          onMultipleItemsAdd={handleMultipleItemsAdd}
        />
      </div>
    </Layout>
  );
};

export default Inventory;
