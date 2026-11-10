// SPA (React) uchun REST API router. app.ts da `app.use("/", router)` bilan ulangan,
// shuning uchun bu yerdagi barcha yo'llar "/" dan boshlanadi. Javoblar JSON ko'rinishida qaytadi.
// Auth: cookie'dagi "accessToken" (JWT) orqali.
import express from "express";
const router = express.Router();
import uploader from "./libs/utils/uploader";

import memberController from "./controllers/member_controller";
import productController from "./controllers/product_controller";
import orderController from "./controllers/order_controller";

/** MEMBER */
// router objectiga GET /member/restaurant so'rovi kelsa memberController.getRestaurant ishga tushadi:
// u memberService orqali restoran ma'lumotini bazadan oladi va JSON qaytaradi. Login kerak emas.
router.get("/member/restaurant", memberController.getRestaurant);
// POST /member/login kelsa memberController.login ishga tushadi: req.body dan nick/parolni oladi,
// memberService.login tekshiradi, authService token yaratadi, uni "accessToken" cookie'ga yozadi va member + tokenni qaytaradi.
router.post(`/member/login`, memberController.login);

// POST /member/signup kelsa memberController.signup ishga tushadi: req.body dan yangi user yaratadi,
// token yaratib cookie'ga yozadi va 201 status bilan member + tokenni qaytaradi.
router.post(`/member/signup`, memberController.signup);

// POST /member/logout kelsa avval verifyAuth middleware ishlaydi: cookie'dagi tokenni tekshirib req.member ga yozadi,
// token bo'lmasa yoki noto'g'ri bo'lsa 401 qaytaradi. O'tsa, logout cookie'ni o'chiradi (maxAge: 0).
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout,
);

// GET /member/detail kelsa verifyAuth userni tekshirib req.member ga joylaydi,
// keyin getMemberDetail req.member orqali o'sha userning to'liq ma'lumotini bazadan olib qaytaradi.
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail,
);

// POST /member/update kelsa: 1) verifyAuth userni tekshiradi,
// 2) uploader("members") multer middleware "memberImage" nomli bitta faylni ./uploads/members ga saqlab req.file ga qo'yadi,
// 3) updateMember req.body + rasm yo'li bilan req.member ning ma'lumotlarini yangilaydi.
router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember,
);

// GET /member/top-users kelsa getTopUsers eng faol (top) userlar ro'yxatini qaytaradi. Login kerak emas.
router.get("/member/top-users", memberController.getTopUsers);

/** Product */

// GET /product/all kelsa getProducts ishga tushadi: req.query dan page, limit, order, productCollection, search ni olib
// filter (inquiry) tuzadi va productService orqali mahsulotlar ro'yxatini qaytaradi. Login kerak emas.
router.get("/product/all", productController.getProducts);

// GET /product/:id kelsa avval retrieveAuth ishlaydi: token bo'lsa req.member ga userni yozadi, bo'lmasa ham davom etadi (login ixtiyoriy).
// Keyin getProduct id bo'yicha bitta mahsulotni qaytaradi; memberId bo'lsa (masalan ko'rishlar sonini hisoblash uchun) service'ga beriladi.
router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct,
);

/** Order*/

// POST /order/create kelsa verifyAuth userni tekshiradi, keyin createOrder
// req.member va req.body (buyurtma itemlari) bilan orderService orqali yangi buyurtma yaratadi.
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder,
);

// GET /order/all kelsa verifyAuth userni tekshiradi, keyin getMyOrders req.query dan page, limit, orderStatus ni olib
// faqat shu userning (req.member) buyurtmalarini filter bo'yicha qaytaradi.
router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders,
);

// POST /order/update kelsa verifyAuth userni tekshiradi, keyin updateOrder req.body (orderId, yangi status)
// bo'yicha shu userning buyurtmasini yangilaydi.
router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder,
);

export default router;
