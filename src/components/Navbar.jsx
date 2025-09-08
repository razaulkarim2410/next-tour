// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import { useState, useEffect } from "react";

// export default function Navbar() {
//   const { data: session } = useSession(); // ✅ removed "status"
//   const pathname = usePathname();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [theme, setTheme] = useState("light");

//   const navItems = [
//     { href: "/", label: "Home" },
//     { href: "/all-products", label: "All Products" },
//     { href: "/dashboard/add-product", label: "Dashboard" },
//   ];

//   // ✅ load theme from localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedTheme = localStorage.getItem("theme") || "light";
//       setTheme(savedTheme);
//       document.documentElement.setAttribute("data-theme", savedTheme);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     document.documentElement.setAttribute("data-theme", newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   const handleMenuClick = () => setMenuOpen(false);

//   return (
//     <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
//       <div className="w-11/12 mx-auto flex justify-between items-center">
//         {/* Logo (left) */}
//         <Link
//           href={"/"}
//           className="text-2xl flex items-center gap-2 navbar-start"
//         >
//           <Image src={"/assets/logo.png"} width={25} height={25} alt="Logo" />
//           NextTour
//         </Link>

//         {/* Desktop nav (center) */}
//         <div className="hidden lg:flex navbar-center">
//           <ul className="menu menu-horizontal">
//             {navItems.map((item) => (
//               <li key={item.href}>
//                 <Link
//                   href={item.href}
//                   className={`px-3 py-2 rounded-md transition ${
//                     pathname === item.href
//                       ? "text-orange-600 font-bold border-b-2 border-orange-600"
//                       : "hover:text-orange-500"
//                   }`}
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right side */}
//         <div className="navbar-end flex items-center gap-3">
//           {/* ✅ Dark/Light toggle (desktop only) */}
//           <div className="hidden lg:block">
//             <button onClick={toggleTheme} className="btn btn-ghost">
//               {theme === "light" ? "🌙" : "☀️"}
//             </button>
//           </div>

//           {/* Auth buttons (no loading state) */}
//           {session ? (
//             <button
//               onClick={() => signOut({ callbackUrl: "/" })}
//               className="btn bg-orange-600 text-white hover:bg-amber-700"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link
//               className="btn bg-orange-600 text-white hover:bg-amber-700"
//               href={"/login"}
//             >
//               Login
//             </Link>
//           )}

//           {/* Mobile menu (right side) */}
//           <div className="lg:hidden relative">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="btn btn-ghost"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h8m-8 6h16"
//                 />
//               </svg>
//             </button>

//             {menuOpen && (
//               <ul className="menu menu-sm absolute right-0 bg-base-100 rounded-box z-10 mt-3 w-52 shadow">
//                 {navItems.map((item) => (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       onClick={handleMenuClick}
//                       className={
//                         pathname === item.href
//                           ? "text-orange-600 font-bold"
//                           : ""
//                       }
//                     >
//                       {item.label}
//                     </Link>
//                   </li>
//                 ))}
//                 {/* ✅ Dark/Light toggle (mobile only, inside menu) */}
//                 <li>
//                   <button onClick={toggleTheme} className="btn btn-ghost">
//                     {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "All Products" },
    { href: "/dashboard/add-product", label: "Dashboard", adminOnly: true },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl flex items-center gap-2 navbar-start">
          <Image src="/assets/logo.png" width={25} height={25} alt="Logo" />
          NextTour
        </Link>

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

        <div className="navbar-end flex items-center gap-3">
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





