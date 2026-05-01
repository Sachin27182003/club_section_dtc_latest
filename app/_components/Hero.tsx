"use client";

import React, { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link"; // Import Link from Next.js

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/logo-dtc.png", "/GDG-Logo.png", "/artistia-logo.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="flex flex-col bg-rose-100 dark:bg-rose-950 lg:flex-row text-neutral-600 dark:text-neutral-300 items-center justify-center gap-10 lg:gap-[15vw] min-h-[90vh] py-16 px-4">
        <Reveal
          delay={100}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <h3 className="text-2xl md:text-3xl">Hello, Welcome to</h3>
          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-bold text-orange-500 leading-tight">
            Events
            <br />
            Hub
          </h1>
          <h3 className="text-xl md:text-2xl mt-2">Delhi Technical Campus</h3>
          <p className="text-base md:text-xl mt-6">
            Discover events, connect with clubs and societies, and{" "}
            <br className="hidden md:block" />
            find your community.
          </p>

          {/* Wrapped the button in a Link component */}
          <Link href="/dashboard" className="mt-8">
            <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 hover:underline text-white rounded-md hover:bg-opacity-90 transition-all">
              <LayoutDashboardIcon size={18} />
              Dashboard
            </button>
          </Link>
        </Reveal>

        <Reveal delay={200} className="relative w-50 h-50">
          {slides.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt="Carousel Slide"
              width={50}
              height={50}
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-[100px] shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </Reveal>
      </section>
    </>
  );
}

export default Hero;
