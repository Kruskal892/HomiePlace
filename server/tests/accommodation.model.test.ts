import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import { Booking, DailyInventory, RoomType } from "../models/index.ts";

const roomType = {
  property: new mongoose.Types.ObjectId(),
  name: "Deluxe Double",
  maxGuests: 2,
  beds: 1,
  bathrooms: 1,
  totalUnits: 10,
  nightlyPrice: 800000,
  currency: "VND",
};
const booking = {
  guest: new mongoose.Types.ObjectId(),
  roomType: new mongoose.Types.ObjectId(),
  checkIn: "2026-10-10",
  checkOut: "2026-10-13",
  quantity: 2,
  guests: 4,
  priceBreakdown: { currency: "VND", nightlyPrice: 800000, nights: 3, total: 4800000 },
};

test("room types require integer capacity, inventory, and minor-unit prices", async () => {
  await new RoomType(roomType).validate();
  for (const [path, value] of [
    ["totalUnits", 0],
    ["totalUnits", 1.5],
    ["maxGuests", 0],
    ["nightlyPrice", -1],
    ["nightlyPrice", 1.5],
    ["currency", "ABC"],
    ["name", "   "],
    ["property", undefined],
  ] as const) {
    const document = new RoomType(roomType);
    document.set(path, value);
    await assert.rejects(document.validate());
  }
});

test("inventory requires real calendar dates and nonnegative integer units", async () => {
  const valid = { roomType: booking.roomType, date: "2028-02-29", remainingUnits: 0 };
  await new DailyInventory(valid).validate();
  for (const date of ["2026-02-29", "2026-02-30", "2026-13-01", "2026-1-01", "invalid"]) {
    await assert.rejects(new DailyInventory({ ...valid, date }).validate());
  }
  for (const remainingUnits of [-1, 1.5]) {
    await assert.rejects(new DailyInventory({ ...valid, remainingUnits }).validate());
  }
  assert.ok(
    DailyInventory.schema
      .indexes()
      .some(
        ([keys, options]) =>
          keys.roomType === 1 && keys.date === 1 && options.unique === true,
      ),
  );
});

test("bookings validate checkout-exclusive nights and saved price totals", async () => {
  const document = new Booking(booking);
  await document.validate();
  assert.equal(document.status, "confirmed");
  for (const [path, value] of [
    ["checkOut", "2026-10-10"],
    ["checkOut", "2026-10-09"],
    ["checkIn", "2026-02-30"],
    ["quantity", 0],
    ["guests", 1.5],
    ["priceBreakdown.nights", 2],
    ["priceBreakdown.total", 1],
    ["priceBreakdown.nightlyPrice", Number.MAX_SAFE_INTEGER],
    ["priceBreakdown", undefined],
    ["guest", undefined],
  ] as const) {
    const invalid = new Booking(booking);
    invalid.set(path, value);
    await assert.rejects(invalid.validate(), `Expected rejection for ${path}`);
  }
  await new Booking({
    ...booking,
    checkIn: "2028-02-28",
    checkOut: "2028-03-02",
  }).validate();
});
