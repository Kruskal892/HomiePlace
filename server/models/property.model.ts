import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    addressLine: { type: String, required: true, trim: true, maxlength: 300 },
    area: { type: String, trim: true, maxlength: 100 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    province: { type: String, required: true, trim: true, maxlength: 100 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    postalCode: { type: String, trim: true, maxlength: 20 },
  },
  { _id: false },
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 10000 },
    propertyType: {
      type: String,
      enum: [
        "hotel",
        "homestay",
        "resort",
        "hostel",
        "guesthouse",
        "apartment",
        "villa",
        "house",
      ],
      required: true,
    },
    address: { type: addressSchema, required: true },
    timezone: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          try {
            new Intl.DateTimeFormat("en", { timeZone: value });
            return true;
          } catch {
            return false;
          }
        },
        message: "Timezone must be a supported IANA timezone",
      },
    },
    areaSize: {
      type: Number,
    },
    amenities: [{ type: String, required: true, trim: true, maxlength: 100 }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    images: [
      {
        type: String,
        required: true,
        trim: true,
        maxlength: 2048,
        validate: {
          validator: (value: string) => {
            try {
              const url = new URL(value);
              return url.protocol === "https:" && !url.username && !url.password;
            } catch {
              return false;
            }
          },
          message: "Images must use HTTPS URLs without credentials",
        },
      },
    ],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    views: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Views must be a safe integer",
      },
    },
    viewedBy: [{ type: String }],
  },
  { timestamps: true },
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
