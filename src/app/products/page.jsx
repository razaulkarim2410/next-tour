"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must login first");
      signIn(undefined, { callbackUrl: "/" }); // redirect after login
    }
  }, [status]);

  // Redirect to home automatically after login
  useEffect(() => {
    if (session) {
      toast.success(`Welcome ${session.user.name}!`);
      router.push("/"); // go to home page
    }
  }, [session, router]);

  if (status === "loading") return <p>Loading...</p>;

  // Optional: you can show loading while redirecting
  if (!session) return null;

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl">Welcome {session.user.name}</h1>
      <p>Here are the products...</p>
    </div>
  );
}
