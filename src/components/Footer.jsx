"use client";

import Image from "next/image";
import Link from "next/link";
// import logo from "@/public/logo.png"; // adjust path to your logo
import FindUs from "@/components/FindUs";   // adjust path to your FindUs component
import React from "react";

export default function Footer() {
  return (
    <div className="w-full">
      <footer className="footer justify-around sm:footer-horizontal bg-orange-600 dark:bg-orange-700 text-neutral-content mt-5 p-10">
        {/* Logo & Contact */}
        <div>
          <div className="flex gap-3 items-center justify-evenly sm:text-center">
            <div className="text-2xl flex items-center gap-2">

              <Image src={"/assets/logo.png"} width={25} height={25} alt="Logo" />
              NextTour
            </div>

          </div>
          <p className="text-white dark:text-gray-300">Email: privacy@hrpulse.com</p>
          <p className="text-white dark:text-gray-300">
            Address: NextTour Inc., 123 Tech Lane, <br /> City Center, CA 90001, USA
          </p>
        </div>

        {/* Company & Legal Links */}
        <div>
          <h6 className="font-bold text-xl text-white dark:text-gray-100">Company & Legal</h6>
          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/about" className="link link-hover text-white dark:text-gray-300">About us</Link>
            </li>
            <li>
              <Link href="/contact" className="link link-hover text-white dark:text-gray-300">Contact</Link>
            </li>
            <li>
              <Link href="/terms" className="link link-hover text-white dark:text-gray-300">Terms of use</Link>
            </li>
            <li>
              <Link href="/privacy" className="link link-hover text-white dark:text-gray-300">Privacy policy</Link>
            </li>
            <li>
              <Link href="/cookie" className="link link-hover text-white dark:text-gray-300">Cookie policy</Link>
            </li>
          </ul>
        </div>

        {/* Social/FindUs Component */}
        <div>
          <FindUs />
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-orange-600 dark:bg-orange-700 text-center text-white dark:text-gray-100 pb-1">
        © 2025  NextTour. All rights reserved.
      </div>
    </div>
  );
}
