
export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem extends Product {
  quantityInBill: number;
  discount: number;
  total: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  cashierId: string;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  createdAt: string;
}
