"use client";

import React from "react";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";

export default function FindUs() {
  const socialLinks = [
    {
      icon: <SiFacebook />,
      name: "Facebook",
      href: "https://www.facebook.com/share/179nE1FpYY/",
    },
    {
      icon: <FaLinkedin />,
      name: "LinkedIn",
      href: "https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit",
    },
    {
      icon: <FaXTwitter />,
      name: "Twitter",
      href: "https://x.com/RazaulKarim2410",
    },
    {
      icon: <IoLogoYoutube />,
      name: "YouTube",
      href: "https://www.youtube.com/@Farzankarim-sd7lu",
    },
  ];

  return (
    <div>
      <h2 className="font-bold text-xl mb-5">Find Us On</h2>
      <div className="flex flex-col gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-l hover:text-orange-500 transition-colors"
          >
            {link.icon} {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
