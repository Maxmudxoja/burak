// ORDER bilan bog'liq TypeScript interfacelari.
import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order_enum";
import { Product } from "./product";

// Buyurtma ichidagi bitta mahsulot qatori (Orderitem_model ga mos).
export interface OrderItem {
  _id: ObjectId;
  itemQuntity: number;
  itemPrice: number;
  orderId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Quyidagilar bazada saqlanmaydi, getMyOrders dagi $lookup aggregation natijasida qo'shiladi.
  /**From aggregation */
  orderItems: OrderItem[];
  productData: Product[];
}

// Bazadagi buyurtma (Order_model ga mos): umumiy summa, yetkazish narxi, status va egasi (memberId).
export interface Order {
  _id: ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// createOrder da req.body sifatida keladigan massivning bitta elementi.
// orderId clientdan kelmaydi, service order yaratgandan keyin o'zi qo'shadi.
export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: ObjectId;
  orderId?: ObjectId;
}

// getMyOrders uchun req.query dan tuziladigan filter: sahifa, limit va qaysi statusdagi buyurtmalar.
export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

// updateOrder da keladigan ma'lumot: qaysi buyurtma va qaysi yangi status.
export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
