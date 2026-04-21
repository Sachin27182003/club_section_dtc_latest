import React from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import Link from "next/link"; // 1. Import Next.js Link

function TechnicalSociety() {
  const technicalSocietyData = [
    { img: "ACE.png", name: "ACE DTC", desc: "Blockchain | AR VR" },
    { img: "AIR.jpeg", name: "AIR DTC", desc: "AI ML" },
    {
      img: "CESTA.jpeg",
      name: "CESTA DTC",
      desc: "DSA | Gaming | IOT",
    },
    {
      img: "ECELL LOGO.png",
      name: "E-CELL DTC",
      desc: "Entrepreneurship",
    },
    {
      img: "FOSS.png",
      name: "FOSS DTC",
      desc: "Open Source | Linux",
    },
    { img: "GDG-Logo.png", name: "GDG DTC", desc: "Google Tech" },
    { img: "GFG.jpeg", name: "GFG DTC", desc: "Resources" },
    {
      img: "INDUS.jpg",
      name: "INDUS RISE",
      desc: "Economics & Tech",
    },
  ];

  return (
    <>
      <div className="bg-rose-100 dark:bg-slate-900 border-2 border-indigo-900 dark:border-indigo-400 rounded-3xl p-6 md:p-8 mb-6 transition-colors duration-300">
        <Reveal delay={100}>
          <h2 className="text-2xl text-neutral-700 dark:text-neutral-200 font-semibold mb-8 transition-colors duration-300">
            Technical (8)
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-colors duration-300">
          {technicalSocietyData.map((club, i) => {
            // Generate a URL-friendly slug from the club name (e.g., "ACE DTC" -> "ace-dtc")
            const clubSlug = club.name.toLowerCase().replace(/\s+/g, "-");

            return (
              <Reveal key={i} delay={100 * (i % 4)}>
                {/* 2. Changed the div to a Link and added the href */}
                <Link
                  href={`/clubs/${clubSlug}`}
                  className="bg-white dark:bg-slate-800 border-2 border-indigo-900 dark:border-indigo-400 text-gray-900 dark:text-gray-100 p-6 rounded-xl flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full"
                >
                  <Image
                    src={`/${club.img}`}
                    alt={club.name}
                    width={72} // 3. Fixed: Must be a whole number
                    height={72} // 3. Fixed: Must be a whole number
                    className="w-18 h-18 rounded-full object-cover shadow-md mb-3" // Fixed Tailwind classes
                  />
                  <h3 className="font-bold text-lg">{club.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                    {club.desc}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default TechnicalSociety;
