

import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.js";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ always use NEXTAUTH_SECRET
  providers: [
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, otp } = credentials;

        const user = await User.findOne({ email });
        if (!user) return null;

        // check OTP validity
        if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
          return null;
        }

        // clear OTP after successful login
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
