export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerEmail: string;
  items: OrderItem[];
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
