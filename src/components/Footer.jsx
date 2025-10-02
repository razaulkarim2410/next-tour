"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import FindUs from "@/components/FindUs"; // adjust path if needed

export default function Footer() {
  return (
    <div className="w-full">
      <footer className="footer justify-around sm:footer-horizontal bg-orange-600 dark:bg-orange-700 text-neutral-content mt-5 p-10">
        {/* Logo & Contact */}
        <div>
          <div className="flex gap-3 items-center justify-evenly sm:text-center">
            <div className="text-2xl flex items-center gap-2">
              <Image src="/assets/logo.png" width={25} height={25} alt="Logo" />
              NextTour
            </div>
          </div>
          <p className="text-white dark:text-gray-300">Email: farzankarim2410@gmail.com</p>
          <p className="text-white dark:text-gray-300">
            Address: 123 Market Street, <br /> Dhaka, Bangladesh 
          </p>
          <p>Mobile: +880-1912278356</p>
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

      {/* Payment Methods Section */}
      <div className="bg-orange-600 dark:bg-orange-700 py-6">
        <h6 className="text-white text-center mb-4 text-xl font-semibold">
        Payment Methods
        </h6>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Image
            src="/images/bkash.png"
            alt="Bkash"
            width={80}
            height={20}
            className="h-10 w-auto object-contain bg-white"
          />
          <Image
            src="/images/nagad.jpeg"
            alt="Nagad"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/bank.jpeg"
            alt="Bank"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/rocket.jpeg"
            alt="Rocket"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/visacard.png"
            alt="Visacard"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/mastercard.png"
            alt="Mastercard"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
          <Image
            src="/images/cash.jpg"
            alt="Cash"
            width={80}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>


      {/* Copyright */}
      <div className="bg-orange-600 dark:bg-orange-700 text-center text-white dark:text-gray-100 pb-1">
        © 2025 NextTour. All rights reserved.
      </div>
    </div>
  );
}
