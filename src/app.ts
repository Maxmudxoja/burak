// EXPRESS APP SOZLAMALARI. Har bir kelgan so'rov (request) shu fayldagi middleware'lardan
// yuqoridan pastga ketma-ket o'tadi: static -> body parse -> cookie -> log -> session -> views -> router.
import express from "express";
import path, { dirname } from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

// connect-mongodb-session: session ma'lumotlarini xotirada emas, MongoDB da saqlash uchun store yaratadi.
const MongoDBStore = ConnectMongoDB(session);

// Sessionlar MongoDB dagi "sessions" collection'iga yoziladi (server qayta ishga tushsa ham login saqlanib qoladi).
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1-ENTRANCE **/
// express app objecti yaratiladi.
const app = express();
// public papkasidagi fayllar (css, js, img) to'g'ridan-to'g'ri brauzerga beriladi.
app.use(express.static(path.join(__dirname, `public`)));
// /uploads/... yo'li orqali yuklangan rasmlar (members, products) ochiq beriladi.
app.use("/uploads", express.static("./uploads"));
// HTML form (x-www-form-urlencoded) dan kelgan ma'lumotni req.body ga o'giradi (admin EJS formalar uchun).
app.use(express.urlencoded({ extended: true }));
// JSON body ni req.body ga o'giradi (React SPA so'rovlari uchun).
app.use(express.json());
// Cookie'larni o'qib req.cookies ga joylaydi (verifyAuth "accessToken" ni shu yerdan oladi).
app.use(cookieParser());
// Har bir so'rovni MORGAN_FORMAT ko'rinishida terminalga log qiladi (method, url, vaqt, status).
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
// express-session: admin login uchun session. Brauzerga session id cookie beriladi, ma'lumot esa MongoDB store'da turadi.
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, //6 soat
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);

// Har bir so'rovda session'dagi member res.locals.member ga qo'yiladi,
// shunda barcha EJS sahifalarda `member` o'zgaruvchisi to'g'ridan-to'g'ri ishlatiladi.
app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/** 3-VIEWS **/
// res.render("...") chaqirilganda EJS fayllar src/views papkasidan olinadi.
app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);

/** 4-ROUTERS **/

// /admin bilan boshlanadigan so'rovlar routerAdmin ga, qolgan hammasi router ga yo'naltiriladi.
app.use(`/admin`, routerAdmin); //BSSR: EJS
app.use(`/`, router); // SPA:REACT
// app server.ts da import qilinib listen qilinadi.
export default app;
