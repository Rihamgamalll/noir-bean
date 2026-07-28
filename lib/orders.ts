export type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  temperature?: string;
  sugar?: string;
};
export type OrderStatus = "NEW"|"CONFIRMED"|"PREPARING"|"READY"|"OUT_FOR_DELIVERY"|"COMPLETED"|"CANCELLED";
export type Order = {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};
