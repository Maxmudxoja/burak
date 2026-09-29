import MemberModel from "../schema/Member_model";
import { Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member_enum";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({
        memberType: MemberType.RESTAURANT,
      })
      .exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    try {
      const result = await this.memberModel.create(input);
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }

    // const tempResult = new this.memberModel(input);
    // const result = await tempResult.save();
    // result.memberPassword = "";
  }
}

export default MemberService;
