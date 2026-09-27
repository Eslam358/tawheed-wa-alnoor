import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      city: String,
      area: String,
      street: String,
      notes: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: String,
    itemsPrice: Number,
    shippingPrice: { type: Number, default: 0 },
    totalPrice: Number,
    status: {
      type: String,
      enum: ["قيد المراجعة", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"],
      default: "قيد المراجعة",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
