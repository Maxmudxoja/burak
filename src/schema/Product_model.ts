// PRODUCT SCHEMA: "products" collection. Restoran menyusidagi har bir mahsulot.
import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../libs/enums/product_enum";

const productSchema = new Schema(
  {
    // Yangi mahsulot PAUSE (sotuvda emas) bo'ladi, admin PROCESS qilsa SPA'da ko'rinadi.
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    // Kategoriya majburiy (DISH, SALAD, DESSERT, DRINK, OTHER).
    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    // Omborda qolgan soni.
    productLeftCount: {
      type: Number,
      required: true,
    },

    // Porsiya o'lchami, default NORMAL.
    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.NORMAL,
    },

    // Ichimlik hajmi, default 1 litr.
    productVolume: {
      type: Number,
      enum: ProductVolume,
      default: ProductVolume.ONE,
    },

    productDesc: {
      type: String,
    },

    // Rasm yo'llari massivi (admin 5 tagacha yuklay oladi).
    productImages: {
      type: [String],
      default: [],
    },

    // Ko'rishlar soni: login bo'lgan user mahsulotni birinchi marta ochganda +1.
    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, //updatedAt and createdAt
);

// Murakkab unique index: bir xil nom + o'lcham + hajmdagi mahsulotni ikki marta yaratib bo'lmaydi.
productSchema.index(
  { productName: 1, productSize: 1, productVolume: 1 },
  { unique: true },
);

export default mongoose.model("Product", productSchema);
