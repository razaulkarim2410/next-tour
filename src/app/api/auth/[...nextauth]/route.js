

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        const { email, otp } = credentials;

        const user = await User.findOne({ email });
        if (!user) return null;

        if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) return null;

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name || user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  // secret: process.env.JWT_SECRET,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
