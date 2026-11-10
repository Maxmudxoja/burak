// MEMBER SERVICE: member bilan bog'liq barcha business logic va bazaga murojaatlar.
// Oqim: router -> controller (req/res bilan ishlaydi) -> SERVICE (logika + baza) -> schema/model (MongoDB).
import MemberModel from "../schema/Member_model";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member_enum";
import bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

// Controller'lar `new MemberService()` qilib shu class metodlarini chaqiradi.
class MemberService {
  private readonly memberModel;

  constructor() {
    // Member modeli class ichida saqlanadi, barcha metodlar this.memberModel orqali bazaga murojaat qiladi.
    this.memberModel = MemberModel;
  }

  /**SPA*/

  // Bazadan memberType = RESTAURANT bo'lgan yagona restoranni topadi. Topilmasa 404.
  public async getRestaurant(): Promise<Member> {
    const result = await this.memberModel
      .findOne({
        memberType: MemberType.RESTAURANT,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // SPA signup: parolni bcrypt bilan hash qiladi, yangi member yaratadi,
  // javobdan parolni olib tashlab qaytaradi. Nick/phone band bo'lsa (unique xato) 400 USED_NICK_PHONE.
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.error("Error , model Sign up: ", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }

    // const tempResult = new this.memberModel(input);
    // const result = await tempResult.save();
    // result.memberPassword = "";
  }

  // SPA login: 1) nick bo'yicha (DELETE bo'lmagan) memberni topadi, parolni ham olib keladi (select: false bo'lgani uchun aniq so'raladi),
  // 2) topilmasa 404, BLOCK bo'lsa 403, 3) bcrypt.compare bilan parolni tekshiradi, noto'g'ri bo'lsa 401,
  // 4) to'g'ri bo'lsa memberni to'liq (parolsiz) qaytaradi.
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 },
      )
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword!,
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).lean().exec();
  }

  // Token'dagi member _id si bo'yicha faqat ACTIVE memberni bazadan yangidan oladi.
  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // Login bo'lgan memberning o'z ma'lumotlarini yangilaydi. { new: true } - yangilangan versiyani qaytaradi.
  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  // Kamida 1 ballga ega ACTIVE userlarni ball bo'yicha kamayish tartibida saralab, eng yaxshi 4 tasini qaytaradi.
  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 1 },
      })
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // OrderService chaqiradi: ACTIVE USER ning memberPoints ini $inc bilan `point` ga oshiradi.
  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    return await this.memberModel
      .findOneAndUpdate(
        {
          _id: memberId,
          memberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
        },
        { $inc: { memberPoints: point } },
        { new: true },
      )
      .exec();
  }

  /**SSR*/

  // Admin signup: tizimda faqat BITTA restoran bo'lishi mumkin, allaqachon bor bo'lsa 400.
  // Keyin parolni hash qilib RESTAURANT turidagi member yaratadi.
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({
        memberType: MemberType.RESTAURANT,
      })
      .exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);

    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }

    // const tempResult = new this.memberModel(input);
    // const result = await tempResult.save();
  }

  // Admin login: nick bo'yicha topadi, bcrypt bilan parolni tekshiradi, to'g'ri bo'lsa memberni qaytaradi (controller uni session'ga yozadi).
  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 },
      )
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword!,
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).exec();
  }

  // Admin panel uchun barcha USER turidagi memberlar ro'yxati.
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // Admin tanlagan userni (input._id) yangilaydi, masalan memberStatus ni BLOCK qilish.
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default MemberService;
