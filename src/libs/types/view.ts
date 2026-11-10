// VIEW (ko'rishlar) interfacelari: qaysi user qaysi mahsulotni ko'rganini saqlash uchun.
import { ObjectId } from "mongoose";
import { ViewGroup } from "../enums/view_enum";

// Bazadagi view yozuvi (View_model ga mos).
export interface View {
  _id: ObjectId;
  viewGroup: ViewGroup;
  memberId: ObjectId;
  viewRefId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Yangi view yozish uchun input: kim (memberId), nimani (viewRefId), qaysi guruhda (viewGroup).
export interface ViewInput {
  memberId: ObjectId;
  viewGroup: ViewGroup;
  viewRefId: ObjectId;
}
