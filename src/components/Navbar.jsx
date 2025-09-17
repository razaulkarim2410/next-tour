"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart = [], loading } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "All Products" },
    { href: "/dashboard/add-product", label: "Dashboard", adminOnly: true },
  ];

  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl flex items-center gap-2">
          <Image src="/assets/logo.png" width={25} height={25} alt="Logo" />
          NextTour
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal">
            {navItems.map(
              (item) =>
                (!item.adminOnly || session?.user?.role === "admin") && (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-md transition ${
                        pathname === item.href
                          ? "text-orange-600 font-bold border-b-2 border-orange-600"
                          : "hover:text-orange-500"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </div>

        {/* Right Side: Cart + Auth + Menu Button (Mobile) */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative text-2xl">
            🛒
            {!loading && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:block">
            {session ? (
              <button
                onClick={() => signOut({ redirect: false })}
                className="btn bg-orange-600 text-white hover:bg-amber-700"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn bg-orange-600 text-white hover:bg-amber-700">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-2xl p-2 focus:outline-none"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col p-4 space-y-3">
            {navItems.map(
              (item) =>
                (!item.adminOnly || session?.user?.role === "admin") && (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md transition ${
                        pathname === item.href
                          ? "text-orange-600 font-bold bg-orange-50"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setMenuOpen(false)} // Close menu after click
                    >
                      {item.label}
                    </Link>
                  </li>
                )
            )}
            <li>
              {session ? (
                <button
                  onClick={() => {
                    signOut({ redirect: false });
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-orange-600 text-white rounded hover:bg-amber-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 bg-orange-600 text-white rounded hover:bg-amber-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
