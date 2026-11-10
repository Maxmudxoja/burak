// UMUMIY SOZLAMALAR (config) va yordamchi funksiyalar.

// JWT token va accessToken cookie amal qilish muddati (soatda): 24 soat.
export const AUTH_TIMER = 24;

// morgan log formati: so'rov method, url, javob vaqti va status kodi.
export const MORGAN_FORMAT = `:method :url :response-time ms [:status] \n`;

import mongoose from "mongoose";
// String ko'rinishidagi id ni mongoose ObjectId ga o'giradi (bazada qidirish uchun).
// Agar allaqachon ObjectId bo'lsa, o'zgartirmasdan qaytaradi.
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
