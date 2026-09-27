import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "المنزل" },
    fullName: String,
    phone: String,
    city: String,
    area: String,
    street: String,
    notes: String,
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false }, // غير موجود لو دخل بجوجل
    image: String,
    phone: String,
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
