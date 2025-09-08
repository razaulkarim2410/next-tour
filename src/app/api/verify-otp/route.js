// // src/app/api/verify-otp/route.js
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { email, otp } = await req.json();

//     if (!email || !otp) {
//       return new Response(
//         JSON.stringify({ error: "Email and OTP are required." }),
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return new Response(
//         JSON.stringify({ error: "User not found." }),
//         { status: 404 }
//       );
//     }

//     if (!user.otp || user.otp !== otp) {
//       return new Response(
//         JSON.stringify({ error: "Invalid OTP." }),
//         { status: 401 }
//       );
//     }

//     if (!user.otpExpiry || user.otpExpiry < new Date()) {
//       return new Response(
//         JSON.stringify({ error: "OTP expired." }),
//         { status: 401 }
//       );
//     }

//     // ✅ Clear OTP after successful verification
//     await User.updateOne(
//       { _id: user._id },
//       { $set: { otp: null, otpExpiry: null } }
//     );

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user._id.toString(),
//         email: user.email,
//         role: user.role,
//       },
//       process.env.NEXTAUTH_SECRET,
//       { expiresIn: "7d" }
//     );

//     return new Response(
//       JSON.stringify({
//         message: "OTP verified successfully",
//         token,
//         user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Verify OTP error:", err);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// }


// src/app/api/verify-otp/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 401 });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie for session
    cookies().set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return new Response(JSON.stringify({ message: "Login success", token }), { status: 200 });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}






