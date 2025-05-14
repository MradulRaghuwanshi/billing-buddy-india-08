
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BillItem } from "@/types";
import { ShoppingBag, Trash, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface BillingSidebarProps {
  cart: BillItem[];
  updateCart: (items: BillItem[]) => void;
  checkout: () => void;
}

const BillingSidebar = ({ cart, updateCart, checkout }: BillingSidebarProps) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item removed from cart successfully",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    updateCart(
      cart.map(item => 
        item.id === id ? { ...item, quantityInBill: quantity, total: item.price * quantity } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.05);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Current Bill</h2>
        <span className="bg-blue-100 text-blue-700 text-sm py-1 px-2 rounded-md">
          Items: {cart.length}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-gray-100 p-4 rounded-full mb-2">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="font-medium">No items in bill</p>
            <p className="text-sm">Add items to create a new bill</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-2 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex text-sm text-gray-500 mt-1">
                    <p>₹{item.price.toLocaleString('en-IN')} × </p>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantityInBill}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 h-6 ml-1 px-1 py-0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">₹{item.total.toLocaleString('en-IN')}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">GST (5%)</span>
                <span>₹{calculateTax().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone Number</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <Button
          className="w-full"
          size="lg"
          disabled={cart.length === 0}
          onClick={checkout}
        >
          Checkout (₹{calculateTotal().toLocaleString('en-IN')})
        </Button>
      </div>
    </div>
  );
};

export default BillingSidebar;
