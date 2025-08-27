"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ for active route
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // ✅ get current path

  // Nav items
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "All Products" },
    { href: "/dashboard/add-product", label: "Dashboard" },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 "> 
      {/* sticky navbar */}
      <div className="navbar-start ">
        {/* Mobile dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "text-orange-600 font-bold" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <Link href={"/"} className="text-2xl flex items-center gap-2">
          <Image src={"/assets/logo.png"} width={25} height={25} alt="Logo" />
          NextTour
        </Link>
      </div>

      {/* Desktop nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
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
          ))}
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn bg-orange-600 text-white hover:bg-amber-700"
          >
            Logout
          </button>
        ) : (
          <Link
            className="btn bg-orange-600 text-white hover:bg-amber-700"
            href={"/login"}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
