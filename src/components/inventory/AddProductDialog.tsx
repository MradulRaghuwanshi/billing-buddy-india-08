
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    category: string;
    barcode: string;
    price: string;
    quantity: string;
    expiryDate: string;
  };
  setFormData: (data: any) => void;
  handleAddProduct: () => void;
}

const AddProductDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  setFormData, 
  handleAddProduct 
}: AddProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="E.g. Grocery, Dairy"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({...formData, barcode: e.target.value})}
              placeholder="Enter product barcode"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
