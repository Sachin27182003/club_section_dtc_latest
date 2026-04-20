import React from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import Link from "next/link"; // Added Link for consistency

function Feature() {
  const featuredData = [
    { img: "ACE.png", name: "ACE DTC", desc: "Blockchain | AR VR" },
    { img: "AIR.jpeg", name: "AIR DTC", desc: "AI ML" },
  ];

  return (
    <>
      <div className="bg-rose-100 dark:bg-slate-900 border-2 border-indigo-900 dark:border-indigo-400 rounded-3xl p-6 md:p-8 mb-6 transition-colors duration-300">
        <Reveal delay={100}>
          {/* Added dark:text-neutral-200 */}
          <h2 className="text-2xl text-neutral-700 dark:text-neutral-200 font-semibold mb-8 transition-colors duration-300">
            Feature (2)
          </h2>
        </Reveal>

        {/* Maintained your responsive grid classes. Added dark:border-slate-700 for the wrapper border. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 transition-colors duration-300">
          {featuredData.map((club, i) => {
            // Generate the URL slug for routing
            const clubSlug = club.name.toLowerCase().replace(/\s+/g, "-");

            return (
              <Reveal key={i} delay={100 * (i % 4)}>
                {/* Changed to Link for clickable routing */}
                <Link
                  href={`/clubs/${clubSlug}`}
                  className="bg-white dark:bg-slate-800 border-2 border-indigo-900 dark:border-indigo-400 text-gray-900 dark:text-gray-100 p-6 rounded-xl flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full"
                >
                  <Image
                    src={`/${club.img}`}
                    alt={club.name}
                    width={72} // Fixed: Must be a whole number
                    height={72} // Fixed: Must be a whole number
                    className="w-18 h-18 rounded-full object-cover shadow-md mb-3" // Fixed Tailwind classes
                  />
                  <h3 className="font-bold text-lg">{club.name}</h3>
                  {/* Added dark:text-gray-400 for description text */}
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

export default Feature;
