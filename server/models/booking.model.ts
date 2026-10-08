import mongoose from "mongoose";
import { isStayDate } from "./stay-date.ts";

const priceBreakdownSchema = new mongoose.Schema(
  {
    currency: { type: String, required: true, enum: ["VND", "USD", "EUR"] },
    nightlyPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    nights: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    total: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType", required: true },
    checkIn: { type: String, required: true, validate: isStayDate },
    checkOut: { type: String, required: true, validate: isStayDate },
    quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    guests: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    priceBreakdown: { type: priceBreakdownSchema, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true },
);

bookingSchema.pre("validate", function () {
  if (
    !this.checkIn ||
    !this.checkOut ||
    !isStayDate(this.checkIn) ||
    !isStayDate(this.checkOut)
  ) {
    return;
  }
  if (this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Checkout must be after check-in");
    return;
  }
  const nights = (Date.parse(this.checkOut) - Date.parse(this.checkIn)) / 86400000;
  if (this.priceBreakdown && this.priceBreakdown.nights !== nights) {
    this.invalidate("priceBreakdown.nights", "Nights must match the stay dates");
  }
  if (this.priceBreakdown && this.quantity != null) {
    const total = this.priceBreakdown.nightlyPrice * nights * this.quantity;
    if (!Number.isSafeInteger(total) || this.priceBreakdown.total !== total) {
      this.invalidate(
        "priceBreakdown.total",
        "Total must equal nightly price × nights × quantity",
      );
    }
  }
});

bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ roomType: 1, status: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
