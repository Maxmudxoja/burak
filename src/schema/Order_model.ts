// ORDER SCHEMA: "orders" collection. Bitta buyurtmaning umumiy ma'lumoti (mahsulotlar alohida orderItems da).
import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order_enum";

const OrderSchema = new Schema(
  {
    // Umumiy summa (mahsulotlar + yetkazish).
    orderTotal: {
      type: Number,
      required: true,
    },
    // Yetkazish narxi.
    orderDelivery: {
      type: Number,
      required: true,
    },
    // Yangi buyurtma PAUSE holatida yaratiladi.
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PAUSE,
    },

    // Buyurtma egasi. ref: "Member" - members collection'iga bog'lanish.
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
  },
  // collection: "orders" - collection nomi aniq berilgan.
  { timestamps: true, collection: "orders" },
);

export default mongoose.model("Order", OrderSchema);
