

// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const { data: session } = useSession();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navItems = [
//     { href: "/", label: "Home" },
//     { href: "/all-products", label: "All Products" },
//     { href: "/dashboard/add-product", label: "Dashboard", adminOnly: true },
//   ];

//   return (
//     <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
//       <div className="w-11/12 mx-auto flex justify-between items-center">
//         <Link href="/" className="text-2xl flex items-center gap-2 navbar-start">
//           <Image src="/assets/logo.png" width={25} height={25} alt="Logo" />
//           NextTour
//         </Link>

//         <div className="hidden lg:flex navbar-center">
//           <ul className="menu menu-horizontal">
//             {navItems.map(
//               (item) =>
//                 !item.adminOnly || (item.adminOnly && session?.user?.role === "admin") ? (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       className={`px-3 py-2 rounded-md transition ${
//                         pathname === item.href
//                           ? "text-orange-600 font-bold border-b-2 border-orange-600"
//                           : "hover:text-orange-500"
//                       }`}
//                     >
//                       {item.label}
//                     </Link>
//                   </li>
//                 ) : null
//             )}
//           </ul>
//         </div>

//         <div className="navbar-end flex items-center gap-3">
//           {session ? (
//             <button
//               onClick={() => signOut({ redirect: false })}
//               className="btn bg-orange-600 text-white hover:bg-amber-700"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link href="/login" className="btn bg-orange-600 text-white hover:bg-amber-700">
//               Login
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "All Products" },
    { href: "/dashboard/add-product", label: "Dashboard", adminOnly: true },
  ];

  useEffect(() => {
    const fetchCart = async () => {
      if (!session) return setCartCount(0);
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        const count = data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
        setCartCount(count);
      } catch (err) {
        console.error(err);
        setCartCount(0);
      }
    };
    fetchCart();
  }, [session]);

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl flex items-center gap-2 navbar-start">
          <Image src="/assets/logo.png" width={25} height={25} alt="Logo" />
          NextTour
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex navbar-center">
          <ul className="menu menu-horizontal">
            {navItems.map(
              (item) =>
                !item.adminOnly || (item.adminOnly && session?.user?.role === "admin") ? (
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
                ) : null
            )}
          </ul>
        </div>

        {/* Right side: Cart + Auth */}
        <div className="navbar-end flex items-center gap-4">
          <Link href="/cart" className="relative text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

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
      </div>
    </div>
  );
}





