"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Calendar, MapPin, ExternalLink, X, Globe, Clock } from "lucide-react";

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
};

export function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const eventDetails = [
    { icon: Calendar, label: "When", val: new Date(event.startDate).toLocaleDateString("en-US", { dateStyle: "long" }), color: "text-blue-500" },
    { icon: MapPin, label: "Where", val: event.venue || "Campus", badge: event.isOnline ? "ONLINE" : "OFFLINE", color: "text-purple-500" },
    { icon: Globe, label: "Access", val: "All Departments", color: "text-indigo-500" },
    { icon: Clock, label: "Status", val: isPast ? "Closed" : "Open Now", color: "text-emerald-500" },
  ];

  return (
    <>
      {/* --- THE CARD --- */}
      <div className="group dark:bg-[#0f172a] bg-white rounded-[28px] overflow-hidden shadow-lg dark:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border-2 dark:border-indigo-400 border-indigo-200">
        
        {/* Society Header */}
        <div className="p-4 flex items-center gap-3 bg-gradient-to-b dark:from-white/5 from-black/[0.02] to-transparent">
          <div className="relative h-10 w-10 shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow opacity-70" />
            <div className="absolute inset-[1.5px] rounded-full dark:bg-[#0f172a] bg-white flex items-center justify-center overflow-hidden">
               <Image src={event.organizer?.logoUrl || "/default-club-logo.png"} width={36} height={36} className="object-cover w-full h-full" alt="logo" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black dark:text-indigo-400 text-indigo-600 uppercase tracking-widest leading-none mb-0.5">
               {event.organizer?.type || "Technical"}
            </span>
            <h4 className="font-bold text-xs dark:text-white text-gray-900 truncate leading-tight">
              {event.organizer?.name}
            </h4>
          </div>
        </div>

        {/* Poster Section with FLOATING BADGE */}
        <div 
          onClick={() => setIsOpen(true)} 
          className="relative aspect-square w-full dark:bg-[#161d2e] bg-gray-50 cursor-pointer overflow-hidden border-y dark:border-white/5 border-black/5"
        >
          <Image
            src={event.coverImageUrl || "/placeholder-event.jpg"}
            fill 
            className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
            alt={event.title}
          />
          
          {/* FLOATING STATUS BADGE */}
          <div className="absolute top-3 right-3">
             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border ${
               isPast 
               ? 'dark:bg-green-700 bg-green-500 dark:text-neutral-200 text-neutral-800 border-white/10' 
               : 'bg-indigo-600 text-white border-indigo-400/30'
             }`}>
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
          </div>
        </div>

        {/* Info & Register */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div onClick={() => setIsOpen(true)} className="cursor-pointer space-y-1.5">
            <h3 className="font-extrabold dark:text-white text-gray-900 text-base leading-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {event.title}
            </h3>
            <div className="flex items-center dark:text-gray-400 text-gray-500 text-[10px] font-bold gap-2">
                <Calendar size={12} className="text-indigo-500" />
                <span className="uppercase tracking-wider">
                  {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
          </div>

          {!isPast && (
            <a href={event.registrationLink} target="_blank" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
              REGISTER <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* --- THE MODAL (TELEPORTED) --- */}
      {isOpen && (
        <Portal>
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/60 dark:bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="dark:bg-[#0b0f1a] bg-white rounded-[40px] w-full max-w-5xl h-auto max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row border dark:border-white/10 border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 z-[10000] p-2 dark:bg-white/10 bg-black/5 hover:bg-black/10 dark:hover:bg-white/20 dark:text-white text-gray-900 rounded-full transition-all backdrop-blur-md"><X size={20} /></button>

              {/* Left: Poster Side */}
              <div className="relative w-full md:w-[40%] h-[300px] md:h-auto dark:bg-[#161d2e] bg-[#f8f9fb] flex items-center justify-center p-8 border-r dark:border-white/5 border-black/5">
                <div className="relative w-full h-full">
                  <Image src={event.coverImageUrl || "/placeholder-event.jpg"} fill className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" alt={event.title} />
                </div>
              </div>

              {/* Right: Content Side */}
              <div className="p-8 md:p-12 flex-1 flex flex-col gap-6 dark:text-white text-gray-900 overflow-y-auto">
                <div className="flex items-center gap-4">
                  <Image src={event.organizer?.logoUrl || "/default-club-logo.png"} width={44} height={44} className="rounded-xl shadow-lg" alt="logo" />
                  <div>
                      <h4 className="font-black text-sm leading-none mb-1">{event.organizer?.name}</h4>
                      <p className="text-[9px] dark:text-gray-400 text-gray-500 font-black uppercase tracking-widest">Organizer</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight dark:text-white text-gray-900">{event.title}</h2>
                  <p className="dark:text-indigo-400 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">Technical Event</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventDetails.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-4 p-4 dark:bg-white/5 bg-gray-50 rounded-[22px] border dark:border-white/5 border-black/5">
                        <div className="p-2.5 dark:bg-white/10 bg-white dark:text-white text-gray-900 rounded-xl shadow-sm"><Icon size={20} strokeWidth={2.5} className={item.color} /></div>
                        <div className="min-w-0">
                          <p className="text-[8px] dark:text-gray-500 text-gray-400 font-black uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="font-bold text-xs truncate uppercase dark:text-gray-100 text-gray-800">{item.val}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t dark:border-white/10 border-black/5">
                  <p className="dark:text-gray-400 text-gray-500 leading-relaxed font-medium text-base whitespace-pre-wrap">{event.description}</p>
                </div>

                {!isPast && (
                  <div className="mt-auto pt-6">
                    <a href={event.registrationLink} target="_blank" className="w-full md:w-fit inline-flex bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl text-[10px]">
                      CONFIRM SPOT
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}