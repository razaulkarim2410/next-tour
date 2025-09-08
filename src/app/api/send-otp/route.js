// // src/app/api/send-otp/route.js
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { email } = await req.json();

//     // ✅ Only find existing user, never create new
//     const user = await User.findOne({ email });
//     if (!user) {
//       return new Response(
//         JSON.stringify({ error: "User not found. Please register first." }),
//         { status: 404 }
//       );
//     }

//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString();
//     // Only update OTP fields, don't touch 'name' or 'email'
//     await User.updateOne(
//       { _id: user._id },
//       { $set: { otp, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) } }
//     );

//     // Send OTP via Gmail
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_SERVER_USER,
//         pass: process.env.EMAIL_SERVER_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP code is: ${otp}`,
//     });

//     return new Response(
//       JSON.stringify({ message: "OTP sent successfully" }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// }
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();

  if (!email)
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

  // Find or create user
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name: email.split("@")[0], role: "user" });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // Save new or updated user
  try {
    await user.save();
    console.log("User saved:", user);
  } catch (err) {
    console.error("Error saving user:", err);
    return new Response(JSON.stringify({ error: "Failed to save user" }), { status: 500 });
  }

  // Send OTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log("OTP sent:", otp, "to", email);
  } catch (err) {
    console.error("Send OTP error:", err);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "OTP sent successfully" }), { status: 200 });
}





