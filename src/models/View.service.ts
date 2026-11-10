// VIEW SERVICE: mahsulot ko'rishlarini yozish/tekshirish. ProductService.getProduct ichidan chaqiriladi.
import Errors, { HttpCode, Message } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View_model";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  // Shu member shu mahsulotni oldin ko'rganmi? Ko'rgan bo'lsa view yozuvini, bo'lmasa null qaytaradi.
  public async checkViewExistence(input: ViewInput): Promise<View | null> {
    return (await this.viewModel
      .findOne({
        memberId: input.memberId,
        viewRefId: input.viewRefId,
      })
      .exec()) as unknown as View | null;
  }

  // Yangi view yozuvini bazaga saqlaydi (member birinchi marta ko'rganda).
  public async insertMemberView(input: ViewInput): Promise<View | null> {
    try {
      return (await this.viewModel.create(input)) as unknown as View | null;
    } catch (err) {
      console.log("Error, insertMemberView", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }
}

export default ViewService;
