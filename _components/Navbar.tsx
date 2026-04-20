"use client";

import { Rocket, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Navbar() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if we are already on the page where the #clubs section exists
    if (window.location.pathname === "/") {
      e.preventDefault();

      // Get the target element by ID
      const targetId = e.currentTarget.href.split("#")[1];
      const elem = document.getElementById(targetId);

      // Scroll to it smoothly
      elem?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex flex-col md:flex-row items-center justify-between lg:justify-center text-neutral-200 lg:gap-[50vw] bg-[#232c72] py-5 px-4 md:px-10 border-b border-indigo-950">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Image
            src={"/logo-dtc.png"}
            alt="DTC Logo"
            width={14}
            height={14}
            className="w-14 h-14 rounded-full object-cover shadow-[0_3px_8px_rgba(0,0,0,0.15)]"
          />
          <span className="text-xl font-bold">DTC Events Hub</span>
        </Link>

        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link
            href="/#clubs"
            onClick={handleScroll}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Users size={18} />
            <span>Clubs</span>
          </Link>
          <Link
            href="/#events" 
            onClick={handleScroll}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Rocket size={18} />
            <span>Events</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
