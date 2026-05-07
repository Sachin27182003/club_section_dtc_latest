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
// 1. Import Suspense from React
import { Suspense } from "react"; 
import { getAllEvents } from "@/actions/eventActions";

export default async function Home() {

  const allEvents = await getAllEvents();

  return (
    <main className="min-h-screen bg-rose-50 dark:bg-rose-950 text-dtc-text overflow-x-hidden font-sans">
      {/* <Navbar /> */}
      <Hero />

      {/* CLUBS & SOCIETIES */}
      <section id="clubs" className="bg-[#232c72] p-6 md:p-10 text-center">
        <Reveal>
          <h1 className="text-3xl text-neutral-200 font-bold mb-6">
            Clubs / Societies
          </h1>
        </Reveal>
        
        {/* 2. Wrap your async components in Suspense boundaries */}
        <Suspense fallback={<div className="text-white p-10">Loading Technical Societies...</div>}>
          <TechnicalSociety />
        </Suspense>

        <Suspense fallback={<div className="text-white p-10">Loading Cultural Societies...</div>}>
          <CulturalSociety />
        </Suspense>

        <Feature />
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="bg-dtc-section p-6 md:p-10">
        <Reveal>
          <h1 className="text-4xl text-center font-bold mb-10">Events</h1>
        </Reveal>

        {/* Note: If UpcomingEvents and PastEvents are ALSO async functions, wrap them in Suspense too! */}
        <Suspense fallback={<div>Loading Events...</div>}>
          <UpcomingEvents events={allEvents} />
        </Suspense>

        <Suspense fallback={<div>Loading Events...</div>}>
          <PastEvents events={allEvents} />
        </Suspense>
      </section>
      
    </main>
  );
}