// VIEW SCHEMA: "views" collection. Qaysi member qaysi mahsulotni ko'rganini saqlaydi,
// shu orqali bitta user bitta mahsulotni necha marta ochmasin, productViews faqat 1 marta oshadi.
import mongoose, { Schema } from "mongoose";
import { ViewGroup } from "../libs/enums/view_enum";

const viewSchema = new Schema(
  {
    // Nima ko'rildi (hozircha faqat PRODUCT).
    viewGroup: {
      type: String,
      enum: ViewGroup,
      required: true,
    },
    // Kim ko'rdi.
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    // Ko'rilgan narsaning id si (masalan productId).
    viewRefId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },

  { timestamps: true },
);

export default mongoose.model("View", viewSchema);
