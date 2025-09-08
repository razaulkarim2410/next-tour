// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";

// export const authOptions = {
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       name: "OTP Login",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         otp: { label: "OTP", type: "text" },
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         const email = credentials.email?.toLowerCase();
//         const otp = credentials.otp;

//         if (!email || !otp) throw new Error("Email and OTP required");

//         const user = await User.findOne({ email });
//         if (!user) throw new Error("User not found");

//         if (!user.otp || user.otp !== otp) throw new Error("Invalid OTP");
//         if (!user.otpExpiry || user.otpExpiry < new Date())
//           throw new Error("OTP expired");

//         // Clear OTP
//         user.otp = null;
//         user.otpExpiry = null;
//         await user.save();

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },

//   pages: { signIn: "/login" },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

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
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
