import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    maxGuests: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    beds: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    bathrooms: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    totalUnits: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    nightlyPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    currency: { type: String, required: true, enum: ["VND", "USD", "EUR"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

roomTypeSchema.index({ property: 1, isActive: 1 });

const RoomType = mongoose.model("RoomType", roomTypeSchema);
export default RoomType;
