// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: false }, // ✅ optional for OTP flow
//     email: { type: String, required: true, unique: true },
//     otp: { type: String },
//     otpExpiry: { type: Date },
//     role: { type: String, default: "user" },
//   },
//   { timestamps: true }
// );

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;


