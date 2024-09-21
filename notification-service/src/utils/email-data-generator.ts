import { Order } from "../services/find-order";
import { User } from "../services/find-user";

export type OrderSummary = {
  orderId: string;
  orderDate: string;
  reference: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  vat: number;
  vatAmount: number;
  userName: string;
};

export const generateOrderSummary = (order: Order, user: User): OrderSummary => {
  const items = order.items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.unitPrice,
  }));

  const total = order.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const vatAmount = Math.round(total * (order.vatRate / 100) * 100) / 100;

  return {
    orderId: order._id,
    orderDate: order.createdAt,
    reference: order.reference,
    total,
    items,
    vat: order.vatRate,
    vatAmount,
    userName: user.name,
  };
}