// PRODUCT SERVICE: mahsulotlar bilan bog'liq business logic. Ichida ViewService ham ishlatiladi (ko'rishlarni hisoblash uchun).
import { T } from "../libs/types/common";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product_enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product_model";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view_enum";

class ProductService {
  private readonly productModel;

  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /**SPA*/

  // SPA mahsulotlar ro'yxati (aggregation bilan):
  // match: faqat PROCESS (sotuvdagi) mahsulotlar + ixtiyoriy kategoriya + nom bo'yicha regex qidiruv ("i" - katta-kichik harf farqsiz),
  // sort: productPrice bo'lsa arzondan qimmatga (1), boshqa maydonlar bo'lsa kamayish tartibida (-1),
  // skip/limit: pagination (masalan page=2, limit=8 -> 8 tasini tashlab keyingi 8 tasi).
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // SPA bitta mahsulot: id bo'yicha PROCESS holatidagi mahsulotni topadi, topilmasa 404.
  // memberId bo'lsa (user login qilgan bo'lsa) view logikasi ishlaydi:
  // user bu mahsulotni oldin ko'rmagan bo'lsa -> view yoziladi va productViews +1, ko'rgan bo'lsa hech narsa qilinmaydi.
  public async getProduct(
    memberId: ObjectId | null,
    id: string,
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    let result = await this.productModel
      .findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    //only authenticated member
    if (memberId) {
      //check existence
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);

      if (!existView) {
        //insert view (save to db)
        await this.viewService.insertMemberView(input);

        //count+1 -> view
        const updatedView = await this.productModel
          .findByIdAndUpdate(
            productId,
            {
              $inc: { productViews: +1 },
            },
            { new: true },
          )
          .exec();

        if (updatedView) result = updatedView;
      }
    }

    return result;
  }

  /**SSR*/

  // Admin panel: statusidan qat'i nazar barcha mahsulotlar.
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // Admin yangi mahsulot yaratadi. Unique index (nom+o'lcham+hajm) buzilsa yoki validatsiya xatosi bo'lsa 400.
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.error("Error , model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }

  // Admin id bo'yicha mahsulotni yangilaydi (masalan productStatus ni PROCESS qilish).
  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    /// String id => Object Id
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default ProductService;
