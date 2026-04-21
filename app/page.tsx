"use client";

// Removed brand icons from the import
import Navbar from "@/app/_components/Navbar";
import { Reveal } from "@/app/_components/Reveal";
import Hero from "@/app/_components/Hero";
import TechnicalSociety from "@/app/_components/TechnicalSociety";
import CulturalSociety from "@/app/_components/CulturalSociety";
import Feature from "@/app/_components/Feature";
import UpcomingEvents from "@/app/_components/UpcomingEvents";
import PastEvents from "@/app/_components/PastEvents";
import Footer from "@/app/_components/Footer";
import Link from "next/link";

// Added local fallback components for the removed brand icons

export default function Home() {
  // --- Carousel Logic ---

  return (
    <main className="min-h-screen bg-rose-50 dark:bg-rose-950 text-dtc-text overflow-x-hidden font-sans">
      {/* <Navbar /> */}
      <Hero />

      {/* CLUBS & SOCIETIES */}
      <section id="clubs" className="bg-[#232c72] p-6 md:p-10 text-center">
        <Reveal>
          <h1 className="text-3xl text-neutral-200 font-bold mb-6">
            Clubs / Societies (17)
          </h1>
        </Reveal>
        <TechnicalSociety />
        <CulturalSociety />
        <Feature />
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="bg-dtc-section p-6 md:p-10">
        <Reveal>
          <h1 className="text-4xl text-center font-bold mb-10">Events</h1>
        </Reveal>

        {/* Upcoming */}
        <UpcomingEvents />

        {/* Past Events Scroll */}
        <PastEvents />
      </section>

      {/* FOOTER */}
      

      {/* COPYRIGHT BOTTOM BAR */}
      
    </main>
  );
}
