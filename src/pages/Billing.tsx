
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/billing/ProductGrid";
import BillingSidebar from "@/components/billing/BillingSidebar";
import { BillItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Billing = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<BillItem[]>([]);

  const addToCart = (product: BillItem) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Item already exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantityInBill += 1;
      updatedCart[existingItemIndex].total = 
        updatedCart[existingItemIndex].price * updatedCart[existingItemIndex].quantityInBill;
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, product]);
    }
  };

  const updateCart = (newCart: BillItem[]) => {
    setCart(newCart);
  };

  const handleCheckout = () => {
    toast({
      title: "Bill Generated",
      description: `Successfully created bill for ${cart.length} items.`,
    });
    setCart([]);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] -mx-4 -my-6">
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-gray-500">Create a new bill by adding products</p>
          </div>
          <ProductGrid addToCart={addToCart} />
        </div>
        
        <div className="w-full lg:w-96 border-t lg:border-t-0">
          <BillingSidebar 
            cart={cart}
            updateCart={updateCart}
            checkout={handleCheckout}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Billing;
