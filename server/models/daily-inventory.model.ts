import mongoose from "mongoose";
import { isStayDate } from "./stay-date.ts";

const dailyInventorySchema = new mongoose.Schema(
  {
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType", required: true },
    date: { type: String, required: true, validate: isStayDate },
    remainingUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
  },
  { timestamps: true },
);

dailyInventorySchema.index({ roomType: 1, date: 1 }, { unique: true });

const DailyInventory = mongoose.model("DailyInventory", dailyInventorySchema);
export default DailyInventory;
