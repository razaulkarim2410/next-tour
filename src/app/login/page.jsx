"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false, // prevent auto redirect
      email,
      password,
    });

    if (res?.error) {
      toast.error(res.error || "Invalid email or password");
    } else if (res?.ok) {
      toast.success("Login successful!");
      router.push("/"); // ✅ redirect to home page
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold">Login</h1>

      <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>
    </div>
  );
}
