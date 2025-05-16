
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductsTable from "@/components/inventory/ProductsTable";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const { state } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.filter === "lowStock") {
      toast({
        title: "Low Stock Items",
        description: "Showing products with low inventory levels.",
      });
    }
  }, [state, toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage your products and stock levels</p>
        </div>

        <ProductsTable />
      </div>
    </Layout>
  );
};

export default Inventory;
