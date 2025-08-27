"use client";

import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function ProductsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;
  if (!session) return null; // middleware handles redirect

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold">Welcome {session.user.name}</h1>
      <p className="mt-2 text-gray-600">Here are the products...</p>
    </div>
  );
}
