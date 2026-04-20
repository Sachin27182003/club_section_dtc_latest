import React from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";

function UpcomingEvents() {
  return (
    <>
      <div className="mb-16 max-w-7xl mx-auto">
        <Reveal delay={100}>
          <h2 className="text-2xl mb-6">Upcoming Events (1)</h2>
        </Reveal>
        <Reveal delay={200}>
          {/* Changed invalid md:w-65 to md:w-[260px] */}
          <div className="w-full md:w-65 bg-white border-2 border-neutral-300 text-black rounded-xl overflow-hidden mx-auto md:mx-0">
            <div className="bg-[#f2f2f2] p-3 flex items-center gap-3">
              <Image
                src="/logo-dtc.png"
                width={32} 
                height={32}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="logo"
              />
              <div>
                <h4 className="font-bold text-sm">IEEE DTC</h4>
                <p className="text-xs text-gray-500">6 months ago</p>
              </div>
            </div>
            
            {/* Added w-full and h-[250px] to the relative wrapper */}
            <div className="relative w-full h-62.5">
              <Image
                src="/ieee-event.jpg"
                fill
                className="object-cover shadow-inner"
                alt="event"
              />
              <span className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Upcoming
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold mb-1">IEEE Umbrella Event</h3>
              <p className="text-sm text-gray-500">📅 Date TBD</p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}

export default UpcomingEvents;