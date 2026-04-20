"use client";

// Removed brand icons from the import
import Navbar from "@/_components/Navbar";
import { Reveal } from "@/_components/Reveal";
import Hero from "@/_components/Hero";
import TechnicalSociety from "@/_components/TechnicalSociety";
import CulturalSociety from "@/_components/CulturalSociety";
import Feature from "@/_components/Feature";
import UpcomingEvents from "@/_components/UpcomingEvents";
import PastEvents from "@/_components/PastEvents";
import Footer from "@/_components/Footer";
import Link from "next/link";

// Added local fallback components for the removed brand icons

export default function Home() {
  // --- Carousel Logic ---

  return (
    <main className="min-h-screen bg-rose-50 text-dtc-text overflow-x-hidden font-sans">
      <Navbar />
      <Hero />

      {/* CLUBS & SOCIETIES */}
      <section id="clubs" className="bg-[#232c72] p-6 md:p-10 text-center">
        <Reveal>
          <h1 className="text-3xl text-neutral-200 font-bold mb-6">Clubs / Societies (17)</h1>
        </Reveal>
        <TechnicalSociety />
        <CulturalSociety />
        <Feature />
      </section>

      {/* EVENTS SECTION */}
      <section id="events"  className="bg-dtc-section p-6 md:p-10">
        <Reveal>
          <h1 className="text-4xl text-center font-bold mb-10">Events</h1>
        </Reveal>

        {/* Upcoming */}
        <UpcomingEvents />

        {/* Past Events Scroll */}
        <PastEvents />
      </section>

      {/* FOOTER */}
      <Footer />
      
      {/* COPYRIGHT BOTTOM BAR */}
      <div className="w-full bg-[#1b225c] text-neutral-300 text-sm py-4 px-4 md:px-10 flex items-center justify-center md:justify-center text-center">
  <p>
    © All rights reserved Delhi Technical Campus | Built by{" "}
    <Link
      href="https://github.com/Sachin27182003"
      target="_blank"
      className="hover:text-white transition-colors"
    >
      Sachin
    </Link>
    {" "} | {" "}
    <Link
      href="https://github.com/rohankamat24"
      target="_blank"
      className="hover:text-white transition-colors"
    >
      Rohan
    </Link>
    {" "} | {" "}
    <Link
      href="https://github.com/Rajat-2005"
      target="_blank"
      className="hover:text-white transition-colors"
    >
      Rajat
    </Link>
    {" "} |
  </p>
</div>
    </main>
  );
}