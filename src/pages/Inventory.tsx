
import Layout from "@/components/layout/Layout";
import ProductsTable from "@/components/inventory/ProductsTable";

const Inventory = () => {
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
