import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order_enum";

export interface OrderItem {
  _id: ObjectId;
  itemQuntity: number;
  itemPrice: number;
  ordrerId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: ObjectId;
  ordrerId?: ObjectId;
}
