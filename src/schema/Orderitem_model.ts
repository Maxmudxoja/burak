// ORDER ITEM SCHEMA: "orderItems" collection. Buyurtma ichidagi har bir mahsulot alohida qator bo'lib saqlanadi.
// Bog'lanish: Order (1) -> OrderItem (ko'p), har bir OrderItem -> bitta Product.
import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    // Nechta dona.
    itemQuantity: {
      type: Number,
      required: true,
    },
    // Buyurtma vaqtidagi narx (keyin mahsulot narxi o'zgarsa ham shu saqlanib qoladi).
    itemPrice: {
      type: Number,
      required: true,
    },
    // Qaysi buyurtmaga tegishli.
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    // Qaysi mahsulot.
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  // collection nomi "orderItems" - getMyOrders dagi $lookup aynan shu nom bilan ulanadi.
  { timestamps: true, collection: "orderItems" },
);

export default mongoose.model("OrderItem", orderItemSchema);
