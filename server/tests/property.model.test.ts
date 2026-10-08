import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import { Property } from "../models/index.ts";

const validProperty = {
  title: " Riverside Stay ",
  description: " A quiet accommodation near the river. ",
  propertyType: "hotel",
  timezone: "Asia/Ho_Chi_Minh",
  address: {
    addressLine: " 12 River Street ",
    city: "Ho Chi Minh City",
    province: "Ho Chi Minh City",
    country: "Vietnam",
  },
  manager: new mongoose.Types.ObjectId(),
  images: ["https://example.com/property.jpg"],
};

test("accommodation types validate with draft defaults and trimmed fields", async () => {
  for (const propertyType of [
    "hotel",
    "homestay",
    "resort",
    "hostel",
    "guesthouse",
    "apartment",
    "villa",
    "house",
  ]) {
    const property = new Property({ ...validProperty, propertyType });
    await property.validate();
    assert.equal(property.title, "Riverside Stay");
    assert.equal(property.address?.addressLine, "12 River Street");
    assert.equal(property.status, "draft");
    assert.equal(property.isVerified, false);
    assert.equal(property.views, 0);
  }
  assert.equal(Property.schema.options.timestamps, true);
});

test("invalid listing fields are rejected", async () => {
  for (const [path, value] of [
    ["title", "   "],
    ["propertyType", "plot"],
    ["address", undefined],
    ["address.city", "   "],
    ["manager", undefined],
    ["status", "sold"],
    ["timezone", "invalid/timezone"],
    ["timezone", undefined],
    ["views", -1],
    ["views", 1.5],
    ["images", ["javascript:alert(1)"]],
    ["images", ["https://user:password@example.com/image.jpg"]],
    ["amenities", ["   "]],
  ] as const) {
    const property = new Property(validProperty);
    property.set(path, value);
    await assert.rejects(property.validate(), `${path} should reject ${String(value)}`);
  }
});
