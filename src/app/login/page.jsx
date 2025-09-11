

"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (session) router.push("/"); // ✅ Redirect to home
  }, [session, router]);

  // Send OTP
  const sendOtp = async () => {
    if (!email) return setMessage("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || "OTP sent");
      if (res.ok) setSent(true);
    } catch (err) {
      setMessage("Failed to send OTP");
      console.error(err);
    }
    setLoading(false);
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) return setMessage("Please enter OTP");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        otp,
      });

      if (res?.error) {
        setMessage("Invalid OTP or credentials");
      } else {
        setMessage("Logged in successfully! Redirecting...");
        router.push("/"); // ✅ Redirect after login
      }
    } catch (err) {
      setMessage("Login failed");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login with OTP
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full p-2 rounded border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          />

          {!sent ? (
            <button
              onClick={sendOtp}
              className="btn btn-primary w-full py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input input-bordered w-full p-2 rounded border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={verifyOtp}
                className="btn btn-primary w-full py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {message && (
            <p
              className={`text-sm mt-2 text-center ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}








