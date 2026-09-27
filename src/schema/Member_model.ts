import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member_enum";

//Schemani qurish usullari
// Schema first-> schemadan foydalanish
//Code first-> code based usulda xosil qilish

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    memberSatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

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

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, //updatedAt and createdAt
);

export default mongoose.model("Member", memberSchema);
