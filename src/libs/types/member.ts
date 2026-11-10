// MEMBER bilan bog'liq TypeScript interfacelari (faqat type tekshiruvi uchun, bazaga ta'sir qilmaydi).
import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member_enum";
import { Request } from "express";
import { Session } from "express-session";

// Bazadan qaytgan to'liq member ko'rinishi (Member_model schema'siga mos).
export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

// Signup paytida clientdan keladigan ma'lumot (req.body). nick, phone, password majburiy.
export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

// Login paytida keladigan ma'lumot: faqat nick va parol.
export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

// Member yangilashda keladigan ma'lumot: _id dan tashqari hamma maydon ixtiyoriy (faqat kelganlari yangilanadi).
export interface MemberUpdateInput {
  _id: ObjectId;

  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

// SPA uchun kengaytirilgan Request: verifyAuth/retrieveAuth req.member ni qo'shadi,
// multer esa req.file (bitta fayl) yoki req.files (bir nechta fayl) ni qo'shadi.
export interface ExtendedRequest extends Request {
  member: Member;

  file: Express.Multer.File;
  files: Express.Multer.File[];
}

// Admin (SSR) uchun kengaytirilgan Request: ExtendedRequest ga o'xshash,
// qo'shimcha ravishda req.session.member (session'da saqlangan login bo'lgan restoran) bor.
export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}
