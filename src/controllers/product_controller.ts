import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product_service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";
const productService = new ProductService();
const productController: T = {};

/**SPA*/

/**SSR*/
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("Get all products");

    res.render("products");
  } catch (err) {
    console.log("Error get all products ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Create new product");
    console.log("req.files: ", req.files);

    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATED_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);
    res.send(
      ` <script> alert("Sucessfully creation !"); window.location.replace("/admin/product/all")</script>`,
    );
  } catch (err) {
    console.log("Error create new product ", err);

    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      ` <script> alert("${message}"); window.location.replace("/admin/product/all")</script>`,
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("Update chosen product");
  } catch (err) {
    console.log("Error update chosen product ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
