import mongoose, { Schema } from "mongoose";
import { MemeberStatus, MemeberType } from "../libs/enums/member_enum";

//Schemani qurish usullari
// Schema first-> schemadan foydalanish
//Code first-> code based usulda xosil qilish

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemeberType,
      default: MemeberType.USER,
    },
    memberSatus: {
      type: String,
      enum: MemeberStatus,
      default: MemeberStatus.ACTIVE,
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

    memberAdress: {
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
