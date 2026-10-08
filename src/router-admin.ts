import express from "express";
const routerAdmin = express.Router();

import restaurantController from "./controllers/restaurant_controller";
import productController from "./controllers/product_controller";

/** Restaurants**/

routerAdmin.get(`/`, restaurantController.goHome);

routerAdmin
  .get(`/login`, restaurantController.getLogin)
  .post(`/login`, restaurantController.processLogin);

routerAdmin
  .get(`/signup`, restaurantController.getSignup)
  .post(`/signup`, restaurantController.processSignup);

routerAdmin.get(`/logout`, restaurantController.logout);
routerAdmin.get(`/check-me`, restaurantController.checkAuthsession);

/** Products**/

routerAdmin.get(`/product/all`, productController.getAllProducts);
routerAdmin.post(`/product/create`, productController.createNewProduct);
routerAdmin.post(`/product/:id`, productController.updateChosenProduct);

/** Users**/
export default routerAdmin;
