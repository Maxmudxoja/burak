// ORDER SERVICE: buyurtma yaratish, olish va yangilash. Order va OrderItem modellari bilan,
// ball qo'shish uchun MemberService bilan ishlaydi.
import OrderItemModel from "../schema/Orderitem_model";
import OrderModel from "../schema/Order_model";
import { Member } from "../libs/types/member";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order_enum";
import MemberService from "./Member.service";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
  }

  // Buyurtma yaratish oqimi: input = [{ productId, itemQuantity, itemPrice }, ...]
  // 1) reduce bilan umumiy summa (narx * soni) hisoblanadi,
  // 2) summa 100 dan kam bo'lsa yetkazish 5, aks holda bepul,
  // 3) Order yaratiladi (orderTotal = summa + yetkazish, status default PAUSE),
  // 4) recordOrderItem bilan har bir mahsulot alohida OrderItem sifatida yoziladi.
  public async createOrder(
    member: Member,
    input: OrderItemInput[],
  ): Promise<Order> {
    console.log("Input: ", input);

    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);

    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      const orderId = newOrder._id;
      console.log("orderId: ", orderId);

      //TODO: create order items
      await this.recordOrderItem(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error , model: createOrder :", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }

  // Har bir item ga orderId biriktiriladi va OrderItem yaratiladi.
  // map async Promise'lar massivini qaytaradi, Promise.all hammasi parallel tugashini kutadi.
  private async recordOrderItem(
    orderId: ObjectId,
    input: OrderItemInput[],
  ): Promise<void> {
    const promisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "Inserted";
    });

    const orderItemState = await Promise.all(promisedList);
    console.log("orderItemState: ", orderItemState);
  }

  // Login bo'lgan userning berilgan statusdagi buyurtmalari (aggregation pipeline):
  // $match -> faqat shu user + status, $sort -> eng yangilari oldin, $skip/$limit -> pagination,
  // 1-$lookup -> orderItems collection'idan shu buyurtma itemlarini "orderItems" ga qo'shadi,
  // 2-$lookup -> o'sha itemlarning productId lari bo'yicha products dan "productData" ni qo'shadi.
  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry,
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches = { memberId: memberId, orderStatus: inquiry.orderStatus };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },

        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // Buyurtma statusini o'zgartirish: faqat o'z buyurtmasini (memberId + orderId mos kelsa) yangilaydi.
  // Topilmasa 304 UPDATE_FAILED. Yangi status PROCESS bo'lsa (user to'lov qildi), userga +1 ball qo'shiladi.
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id),
      orderId = shapeIntoMongooseObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findOneAndUpdate(
        {
          memberId: memberId,
          _id: orderId,
        },
        { orderStatus: orderStatus },
        { new: true },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.PROCESS) {
      const updatedMember = await this.memberService.addUserPoint(member, 1);
      console.log("addUserPoint result:", updatedMember?.memberPoints ?? null);
    }

    return result;
  }
}

export default OrderService;
