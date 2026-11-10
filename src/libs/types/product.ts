// PRODUCT bilan bog'liq TypeScript interfacelari.
import { ObjectId } from "mongoose";

import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../enums/product_enum";

// Bazadagi mahsulot ko'rinishi (Product_model ga mos).
export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
}

// Admin yangi mahsulot yaratganda keladigan ma'lumot (req.body + multer'dan rasm yo'llari).
export interface ProductInput {
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

// Mahsulotni yangilashda keladigan ma'lumot: hamma maydon ixtiyoriy.
export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productSize?: ProductSize;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

// getProducts uchun req.query dan tuziladigan filter:
// order = qaysi maydon bo'yicha saralash, page/limit = pagination, productCollection = kategoriya, search = nom bo'yicha qidiruv.
export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}
