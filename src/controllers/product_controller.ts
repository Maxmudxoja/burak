// PRODUCT CONTROLLER: ham SPA (JSON), ham admin SSR (EJS) uchun mahsulot handler'lari.
import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product_enum";
import { ObjectId } from "mongoose";
const productService = new ProductService();
const productController: T = {};

/**SPA*/

// GET /product/all -> req.query (page, limit, order, productCollection, search) dan ProductInquiry tuzadi.
// query string bo'lgani uchun Number()/String() bilan turiga o'giriladi. Natija JSON.
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");

    const { page, limit, order, productCollection, search } = req.query;
    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    if (productCollection) {
      inquiry.productCollection = productCollection as ProductCollection;
    }
    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error getProducts ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// GET /product/:id -> URL'dan id ni oladi, retrieveAuth qo'ygan req.member bo'lsa uning _id sini, bo'lmasa null beradi.
productController.getProduct = async (
  req: ExtendedRequest & { params: { id: string } },
  res: Response,
) => {
  try {
    console.log("getProduct");
    const { id } = req.params;
    const memberId: ObjectId | null = req.member?._id ?? null;
    const result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/**SSR*/
// GET /admin/product/all -> barcha mahsulotlarni "products" EJS sahifasiga beradi.
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("Get all products");

    const data = await productService.getAllProducts();

    res.render("products", { products: data });
  } catch (err) {
    console.log("Error get all products ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// POST /admin/product/create -> rasm bo'lmasa xato. multer'dan kelgan req.files yo'llarini productImages ga yozadi
// (\\ ni / ga almashtiradi - Windows yo'llari uchun), mahsulot yaratadi va alert bilan product/all ga qaytaradi.
productController.createNewProduct = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("Create new product");
    console.log("req.files: ", req.files);

    console.log("req.body: ", req.body);

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

// POST /admin/product/:id -> URL'dagi id va req.body bilan mahsulotni yangilab JSON qaytaradi.
productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("Update chosen product");

    const id = req.params.id;
    console.log("ID: ", id);

    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error update chosen product ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
