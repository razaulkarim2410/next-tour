

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);

  // ✅ Shared fetchCart function
  const fetchCart = async () => {
    if (!session) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("Cart fetch failed:", res.status);
        setCart([]);
        return;
      }

      const data = await res.json();
      // ✅ Ensure we always get a clean array and filter broken items
      setCart(Array.isArray(data.items) ? data.items.filter(i => i?.product) : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only fetch when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      setCart([]);
      setLoading(false);
    }
  }, [status]);

  // ✅ Safe Update Quantity
  const updateQty = async (productId, newQty) => {
    // find current qty safely
    const currentQty =
      cart.find((i) => i?.product?._id === productId)?.quantity || 0;
    const diff = newQty - currentQty;
    if (diff === 0) return;

    setLoadingIds((prev) => [...prev, productId]);

    // ✅ Optimistic update safely
    setCart((prev) =>
      prev.map((i) =>
        i?.product?._id === productId ? { ...i, quantity: newQty } : i
      )
    );

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: diff }),
      });

      if (!res.ok) throw new Error("Failed to update cart");

      const data = await res.json();
      setCart(Array.isArray(data.items) ? data.items.filter(i => i?.product) : []);
    } catch (err) {
      console.error("Update quantity failed:", err);
      fetchCart(); // fallback to refetch
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // ✅ Safe Remove Item
  const removeFromCart = async (productId) => {
    setLoadingIds((prev) => [...prev, productId]);
    // ✅ filter safely
    setCart((prev) => prev.filter((i) => i?.product?._id !== productId));

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      const data = await res.json();
      setCart(Array.isArray(data.items) ? data.items.filter(i => i?.product) : []);
    } catch (err) {
      console.error("Remove item failed:", err);
      fetchCart(); // fallback
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        loadingIds,
        updateQty,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
