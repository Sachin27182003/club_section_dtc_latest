import React, { useRef } from "react";
import { Reveal } from "./Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

function PastEvents() {
  // --- Horizontal Scroll Logic ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto relative">
        <Reveal delay={100}>
          <h2 className="text-2xl mb-6">Past Events (18)</h2>
        </Reveal>

        <button
          onClick={() => handleScroll("left")}
          className="absolute -left-2.5 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-lg z-10 hover:bg-gray-200 transition-colors hidden md:block"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[1, 2, 3, 4, 5, 6].map((item, i) => (
            <div
              key={i}
              className="min-w-65 bg-white text-black border-2 border-neutral-300 rounded-xl overflow-hidden shrink-0 snap-start"
            >
              <div className="bg-[#f1f1f1] p-3 flex items-center gap-3">
                <Image
                  src="/CESTA.jpeg"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover shadow-sm"
                  alt="logo"
                />
                <div>
                  <h4 className="font-bold text-sm">CESTA DTC</h4>
                  <p className="text-xs text-gray-500">6 months ago</p>
                </div>
              </div>
              <div className="relative w-full h-62.5">
                <Image
                  src="/ieee-event.jpg"
                  fill
                  className="object-cover shadow-inner"
                  alt="event"
                />
                <span className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Past
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">Info Session & Meetup</h3>
                <p className="text-sm text-gray-500">📅 Oct 16, 2024</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute -right-2.5 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-lg z-10 hover:bg-gray-200 transition-colors hidden md:block"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  );
}

export default PastEvents;
