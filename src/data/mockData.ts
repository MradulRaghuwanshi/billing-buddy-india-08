
import { Product, Bill, User } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Tata Salt",
    barcode: "8901234567890",
    category: "Grocery",
    price: 20,
    quantity: 50,
    expiryDate: "2025-12-31",
    createdAt: "2023-01-01T10:00:00Z",
    updatedAt: "2023-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Aashirvaad Atta",
    barcode: "8902345678901",
    category: "Grocery",
    price: 299,
    quantity: 20,
    expiryDate: "2024-11-30",
    createdAt: "2023-01-02T11:00:00Z",
    updatedAt: "2023-01-02T11:00:00Z",
  },
  {
    id: "3",
    name: "Amul Butter",
    barcode: "8903456789012",
    category: "Dairy",
    price: 50,
    quantity: 35,
    expiryDate: "2023-09-15",
    createdAt: "2023-01-03T09:30:00Z",
    updatedAt: "2023-01-03T09:30:00Z",
  },
  {
    id: "4",
    name: "Britannia Good Day",
    barcode: "8904567890123",
    category: "Biscuits",
    price: 30,
    quantity: 45,
    expiryDate: "2023-12-25",
    createdAt: "2023-01-04T14:15:00Z",
    updatedAt: "2023-01-04T14:15:00Z",
  },
  {
    id: "5",
    name: "Colgate Toothpaste",
    barcode: "8905678901234",
    category: "Personal Care",
    price: 60,
    quantity: 40,
    expiryDate: "2025-06-20",
    createdAt: "2023-01-05T16:45:00Z",
    updatedAt: "2023-01-05T16:45:00Z",
  },
  {
    id: "6",
    name: "Dove Soap",
    barcode: "8906789012345",
    category: "Personal Care",
    price: 45,
    quantity: 55,
    expiryDate: "2024-08-10",
    createdAt: "2023-01-06T13:20:00Z",
    updatedAt: "2023-01-06T13:20:00Z",
  },
  {
    id: "7",
    name: "Red Label Tea",
    barcode: "8907890123456",
    category: "Beverages",
    price: 140,
    quantity: 30,
    expiryDate: "2024-05-15",
    createdAt: "2023-01-07T10:10:00Z",
    updatedAt: "2023-01-07T10:10:00Z",
  },
  {
    id: "8",
    name: "Maggi Noodles",
    barcode: "8908901234567",
    category: "Ready to Cook",
    price: 15,
    quantity: 60,
    expiryDate: "2023-11-05",
    createdAt: "2023-01-08T11:55:00Z",
    updatedAt: "2023-01-08T11:55:00Z",
  },
  {
    id: "9",
    name: "Surf Excel",
    barcode: "8909012345678",
    category: "Laundry",
    price: 120,
    quantity: 25,
    expiryDate: "2025-03-12",
    createdAt: "2023-01-09T15:30:00Z",
    updatedAt: "2023-01-09T15:30:00Z",
  },
  {
    id: "10",
    name: "Kissan Ketchup",
    barcode: "8900123456789",
    category: "Sauces",
    price: 85,
    quantity: 15,
    expiryDate: "2023-10-18",
    createdAt: "2023-01-10T09:05:00Z",
    updatedAt: "2023-01-10T09:05:00Z",
  },
];

export const mockBills: Bill[] = [
  {
    id: "B001",
    items: [
      {
        ...mockProducts[0],
        quantityInBill: 2,
        discount: 0,
        total: mockProducts[0].price * 2,
      },
      {
        ...mockProducts[2],
        quantityInBill: 1,
        discount: 0,
        total: mockProducts[2].price * 1,
      },
    ],
    subtotal: mockProducts[0].price * 2 + mockProducts[2].price,
    tax: Math.round((mockProducts[0].price * 2 + mockProducts[2].price) * 0.05),
    discount: 0,
    total: Math.round((mockProducts[0].price * 2 + mockProducts[2].price) * 1.05),
    customerName: "Rahul Kumar",
    customerPhone: "9876543210",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    cashierId: "U001",
  },
  {
    id: "B002",
    items: [
      {
        ...mockProducts[4],
        quantityInBill: 1,
        discount: 0,
        total: mockProducts[4].price,
      }
    ],
    subtotal: mockProducts[4].price,
    tax: Math.round(mockProducts[4].price * 0.05),
    discount: 0,
    total: Math.round(mockProducts[4].price * 1.05),
    customerName: "Priya Singh",
    customerPhone: "8765432109",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    cashierId: "U002",
  }
];

export const mockUsers: User[] = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@storemanager.com",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "U002",
    name: "Cashier User",
    email: "cashier@storemanager.com",
    role: "cashier",
    createdAt: "2023-01-02T00:00:00Z",
  }
];

export const generateDailySales = () => {
  const sales = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    sales.push({
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 5000) + 1000,
      transactions: Math.floor(Math.random() * 20) + 5,
    });
  }
  return sales;
};

export const dailySales = generateDailySales();
