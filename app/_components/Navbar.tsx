"use client";

import { Rocket, Users, LogOut, LayoutDashboardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react"; // Client-side signout
import { Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

function Navbar({ session }: NavbarProps) {
  // Debugging log for session state
  console.log("NAVBAR SESSION CHECK:", session);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const targetId = e.currentTarget.href.split("#")[1];
      const elem = document.getElementById(targetId);
      elem?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between lg:justify-center text-neutral-200 lg:gap-[40vw] bg-[#232c72] py-5 px-4 md:px-10 border-b border-indigo-950">
      <Link
        href="/"
        className="flex items-center gap-2 transition-transform hover:scale-105"
      >
        <Image
          src="/logo-dtc.png"
          alt="DTC Logo"
          width={56}
          height={56}
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

        {/* Conditional Rendering based on session */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
            >
              <LayoutDashboardIcon size={18} />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              className="flex items-center gap-2 bg-rose-500 text-white hover:bg-rose-600 px-5 py-2 rounded-full font-semibold transition-colors shadow-sm ml-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="bg-rose-100 text-[#232c72] hover:bg-neutral-200 px-5 py-2 rounded-full font-semibold transition-colors shadow-sm ml-2 md:ml-4"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
