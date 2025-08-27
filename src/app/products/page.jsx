"use client";
import { useSession, signIn } from "next-auth/react";

export default function ProductsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn(); // redirect to /login
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl">Welcome {session.user.name}</h1>
      <p>Here are the products...</p>
    </div>
  );
}
