"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Login</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })} // ✅ redirect to home
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          signIn("credentials", { 
            email, 
            password,
            callbackUrl: "/"  // ✅ redirect to home
          });
        }}
        className="flex flex-col gap-2"
      >
        <input type="email" name="email" placeholder="Email" className="p-2 border" required />
        <input type="password" name="password" placeholder="Password" className="p-2 border" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Email
        </button>
      </form>
    </div>
  );
}
