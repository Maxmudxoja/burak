// Admin (restoran egasi) uchun BSSR router. app.ts da `app.use("/admin", routerAdmin)` bilan ulangan,
// shuning uchun bu yerdagi barcha yo'llar "/admin" dan boshlanadi. Javoblar asosan EJS sahifa (res.render) yoki redirect.
// Auth: express-session (req.session.member) orqali, JWT emas.
import express from "express";
const routerAdmin = express.Router();

import restaurantController from "./controllers/restaurant_controller";
import productController from "./controllers/product_controller";
import makeUploader from "./libs/utils/uploader";

/** Restaurants**/

// routerAdmin objectiga GET /admin/ kelsa goHome "home" EJS sahifasini render qiladi.
routerAdmin.get(`/`, restaurantController.goHome);

// GET /admin/login kelsa getLogin "login" sahifasini ko'rsatadi.
// POST /admin/login kelsa processLogin req.body dan login ma'lumotini tekshiradi, userni req.session.member ga saqlaydi
// va /admin/product/all ga redirect qiladi. Xato bo'lsa alert chiqarib login sahifasiga qaytaradi.
routerAdmin
  .get(`/login`, restaurantController.getLogin)
  .post(`/login`, restaurantController.processLogin);

// GET /admin/signup kelsa getSignup "signup" sahifasini ko'rsatadi.
// POST /admin/signup kelsa avval makeUploader("members") multer "memberImage" faylini ./uploads/members ga saqlab req.file ga qo'yadi,
// keyin processSignup rasm majburiyligini tekshiradi, memberType = RESTAURANT qilib yangi restoran yaratadi,
// sessionga saqlaydi va /admin/product/all ga redirect qiladi.
routerAdmin
  .get(`/signup`, restaurantController.getSignup)
  .post(
    `/signup`,
    makeUploader("members").single("memberImage"),
    restaurantController.processSignup,
  );

// GET /admin/logout kelsa logout sessionni yo'q qiladi (session.destroy) va /admin ga redirect qiladi.
routerAdmin.get(`/logout`, restaurantController.logout);
// GET /admin/check-me kelsa checkAuthsession sessionda member bor-yo'qligini tekshirib, nick yoki "not authenticated" ni alert qiladi (test uchun).
routerAdmin.get(`/check-me`, restaurantController.checkAuthsession);

/** Products**/

// GET /admin/product/all kelsa avval verifyRestaurant middleware ishlaydi: session'dagi member RESTAURANT turida ekanini tekshiradi,
// to'g'ri bo'lsa req.member ga yozib next() qiladi, aks holda alert bilan /admin/login ga yuboradi.
// Keyin getAllProducts barcha mahsulotlarni olib "products" EJS sahifasida render qiladi.
routerAdmin.get(
  `/product/all`,
  restaurantController.verifyRestaurant,
  productController.getAllProducts,
);
// POST /admin/product/create kelsa: 1) verifyRestaurant restoranni tekshiradi,
// 2) makeUploader("products") multer "productImages" dan 5 tagacha rasmni ./uploads/products ga saqlab req.files ga qo'yadi,
// 3) createNewProduct rasm yo'llarini req.body ga qo'shib yangi mahsulot yaratadi va alert bilan product/all ga qaytaradi.
routerAdmin.post(
  "/product/create",
  restaurantController.verifyRestaurant,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct,
);
// POST /admin/product/:id kelsa verifyRestaurant tekshiradi, keyin updateChosenProduct
// URL'dagi id bo'yicha mahsulotni req.body (masalan productStatus) bilan yangilab JSON qaytaradi.
routerAdmin.post(
  `/product/:id`,
  restaurantController.verifyRestaurant,
  productController.updateChosenProduct,
);

/** Users Member controller**/
// GET /admin/user/all kelsa verifyRestaurant tekshiradi, keyin getUsers barcha userlarni olib "users" EJS sahifasida render qiladi.
routerAdmin.get(
  "/user/all",
  restaurantController.verifyRestaurant,
  restaurantController.getUsers,
);

// POST /admin/user/edit kelsa verifyRestaurant tekshiradi, keyin updateChosenUser
// req.body dagi _id bo'yicha tanlangan userni (masalan memberStatus) yangilab JSON qaytaradi.
routerAdmin.post(
  "/user/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser,
);
export default routerAdmin;
