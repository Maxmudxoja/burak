// MEMBER SCHEMA: MongoDB dagi "members" collection'ining tuzilishi.
// Bu yerda bazaga qanday ma'lumot va qanday qoidalar (required, unique, default) bilan yozilishi belgilanadi.
import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member_enum";

//Schemani qurish usullari
// Schema first-> schemadan foydalanish
//Code first-> code based usulda xosil qilish

const memberSchema = new Schema(
  {
    // USER yoki RESTAURANT. Kiritilmasa USER bo'ladi.
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    // ACTIVE / BLOCK / DELETE. Yangi member ACTIVE bo'ladi.
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    // Nick majburiy va unique (ikki kishi bir xil nick ola olmaydi).
    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    // Telefon majburiy va unique.
    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    // Parol (bcrypt hash). select: false - oddiy find so'rovlarida qaytarilmaydi, faqat aniq so'ralganda.
    memberPassword: {
      type: String,
      select: false,
      required: true,
    },

    memberAddress: {
      type: String,
    },

    memberDesc: {
      type: String,
    },

    // Yuklangan rasm yo'li (masalan uploads/members/uuid.jpg).
    memberImage: {
      type: String,
    },

    // Ballar: buyurtma PROCESS ga o'tganda +1 qo'shiladi, top-users shu bo'yicha saralanadi.
    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, //updatedAt and createdAt
);

// Schema'dan "Member" modeli yaratiladi (collection nomi avtomatik "members"). Service'lar shu model orqali bazaga murojaat qiladi.
export default mongoose.model("Member", memberSchema);
