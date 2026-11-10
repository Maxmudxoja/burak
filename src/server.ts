// LOYIHANING KIRISH NUQTASI (entry point). `npm start` shu faylni ishga tushiradi.
// Ketma-ketlik: .env o'qiladi -> MongoDB ga ulanadi -> ulangandan keyin express app port'da ishga tushadi.

// dotenv .env faylidagi o'zgaruvchilarni (MONGO_URL, PORT, SECRET_TOKEN, SESSION_SECRET) process.env ga yuklaydi.
// Shuning uchun u eng birinchi chaqiriladi, boshqa fayllar process.env dan foydalanishidan oldin.
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
// app.ts dan tayyor sozlangan express app olinadi (middleware, session, router hammasi o'sha yerda).
import app from "./app";

// mongoose MONGO_URL orqali MongoDB ga ulanadi (Promise qaytaradi).
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    // Ulanish muvaffaqiyatli bo'lsa, server PORT da (bo'lmasa 3003 da) so'rovlarni tinglay boshlaydi.
    console.log(`MongoDB connection was succeessful`);
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
      console.info(`The server is running successfully  on port : ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  // Baza ulanmasa server ishga tushmaydi, faqat xato log qilinadi.
  .catch((err) => console.log(`ERROR on connection  MongoDB`, err));
