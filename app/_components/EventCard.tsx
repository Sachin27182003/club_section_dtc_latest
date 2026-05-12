// EventCard.tsx

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Globe,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteEvent } from "@/actions/deleteEvent"; // ADDED
import { useRouter } from "next/navigation"; // ADDED

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
};

export function EventCard({
  event,
  isPast = false,
  allowEdit = false,
  allowDelete = false,
}: {
  event: any;
  isPast?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsDeleteModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDelete = async () => {
    if (deleteInput !== event.title) return;

    setIsDeleting(true);
    try {
      const result = await deleteEvent(event.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Event deleted successfully!");
        setIsOpen(false);
        setIsDeleteModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  const eventDetails = [
    {
      icon: Calendar,
      label: "When",
      val: new Date(event.startDate).toLocaleDateString("en-US", {
        dateStyle: "long",
      }),
      color: "text-blue-500",
    },
    {
      icon: MapPin,
      label: "Where",
      val: event.venue || "Campus",
      badge: event.isOnline ? "ONLINE" : "OFFLINE",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      label: "Access",
      val: "All Departments",
      color: "text-indigo-500",
    },
    {
      icon: Clock,
      label: "Status",
      val: isPast ? "Closed" : "Open Now",
      color: "text-emerald-500",
    },
  ];

  return (
    <>
      {/* --- THE CARD --- */}
      <div className="group dark:bg-[#0f172a] bg-white rounded-[28px] overflow-hidden shadow-lg dark:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border-2 dark:border-indigo-400 border-indigo-200">
        {/* Society Header */}
        <div className="p-4 flex items-center gap-3 bg-linear-to-b dark:from-white/5 from-black/2 to-transparent">
          <div className="relative h-10 w-10 shrink-0">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow opacity-70" />
            <div className="absolute inset-[1.5px] rounded-full dark:bg-[#0f172a] bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={event.organizer?.logoUrl || "/default-club-logo.png"}
                width={36}
                height={36}
                className="object-cover w-full h-full"
                alt="logo"
              />
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

          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border ${
                isPast
                  ? "dark:bg-green-700 bg-green-500 dark:text-neutral-200 text-neutral-800 border-white/10"
                  : "bg-indigo-600 text-white border-indigo-400/30"
              }`}
            >
              {isPast ? "Completed" : "Upcoming"}
            </span>
          </div>
        </div>

        {/* Info & Register */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer space-y-1.5"
          >
            <h3 className="font-extrabold dark:text-white text-gray-900 text-base leading-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center dark:text-gray-400 text-gray-500 text-[10px] font-bold gap-2">
              <Calendar size={12} className="text-indigo-500" />
              <span className="uppercase tracking-wider">
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons Section */}
          {(!isPast || allowEdit || allowDelete) && (
            <div className="flex items-center gap-2 mt-auto">
              {!isPast && (
                <a
                  href={event.registrationLink || "#"}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  REGISTER <ExternalLink size={12} />
                </a>
              )}
              {allowEdit && (
                <Link
                  href={`/events/${event.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className={`bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 ${isPast ? "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] gap-2" : "w-10 h-10 shrink-0"}`}
                  title="Edit Event"
                >
                  {isPast ? (
                    <>
                      <Pencil size={12} /> EDIT
                    </>
                  ) : (
                    <Pencil size={14} />
                  )}
                </Link>
              )}
              {allowDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  className={`bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${isPast ? "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] gap-2" : "w-10 h-10 shrink-0"}`}
                  title="Delete Event"
                >
                  {isPast ? (
                    <>
                      <Trash2 size={12} /> DELETE
                    </>
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- THE DETAILS MODAL --- */}
      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-8 bg-black/60 dark:bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="dark:bg-[#0b0f1a] bg-white rounded-[40px] w-full max-w-5xl h-auto max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row border dark:border-white/10 border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-[10000] p-2 dark:bg-white/10 bg-black/5 hover:bg-black/10 dark:hover:bg-white/20 dark:text-white text-gray-900 rounded-full transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>

              {/* Left: Poster Side */}
              <div className="relative w-full md:w-[40%] h-75 md:h-auto dark:bg-[#161d2e] bg-[#f8f9fb] flex items-center justify-center p-8 border-r dark:border-white/5 border-black/5">
                <div className="relative w-full h-full">
                  <Image
                    src={event.coverImageUrl || "/placeholder-event.jpg"}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    alt={event.title}
                  />
                </div>
              </div>

              {/* Right: Content Side */}
              <div className="p-8 md:p-12 flex-1 flex flex-col gap-6 dark:text-white text-gray-900 overflow-y-auto">
                <div className="flex items-center gap-4">
                  <Image
                    src={event.organizer?.logoUrl || "/default-club-logo.png"}
                    width={44}
                    height={44}
                    className="rounded-xl shadow-lg"
                    alt="logo"
                  />
                  <div>
                    <h4 className="font-black text-sm leading-none mb-1">
                      {event.organizer?.name}
                    </h4>
                    <p className="text-[9px] dark:text-gray-400 text-gray-500 font-black uppercase tracking-widest">
                      Organizer
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight dark:text-white text-gray-900">
                    {event.title}
                  </h2>
                  <p className="dark:text-indigo-400 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    Technical Event
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventDetails.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 dark:bg-white/5 bg-gray-50 rounded-[22px] border dark:border-white/5 border-black/5"
                      >
                        <div className="p-2.5 dark:bg-white/10 bg-white dark:text-white text-gray-900 rounded-xl shadow-sm">
                          <Icon
                            size={20}
                            strokeWidth={2.5}
                            className={item.color}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] dark:text-gray-500 text-gray-400 font-black uppercase tracking-widest mb-0.5">
                            {item.label}
                          </p>
                          <p className="font-bold text-xs truncate uppercase dark:text-gray-100 text-gray-800">
                            {item.val}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t dark:border-white/10 border-black/5">
                  <p className="dark:text-gray-400 text-gray-500 leading-relaxed font-medium text-base whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {/* Modal Footer Actions */}
                {(!isPast || allowEdit || allowDelete) && (
                  <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
                    {!isPast && (
                      <a
                        href={event.registrationLink || "#"}
                        target="_blank"
                        className="w-full md:w-fit inline-flex justify-center bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl text-[10px] flex items-center gap-2"
                      >
                        CONFIRM SPOT <ExternalLink size={14} />
                      </a>
                    )}
                    {allowEdit && (
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="w-full md:w-fit inline-flex justify-center bg-gray-200 dark:bg-white/10 dark:text-white text-gray-900 px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-md text-[10px] flex items-center gap-2"
                      >
                        <Pencil size={14} /> EDIT
                      </Link>
                    )}
                    {allowDelete && (
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full md:w-fit inline-flex justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-md text-[10px] flex items-center gap-2"
                      >
                        <Trash2 size={14} /> DELETE
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* --- THE DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Event
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                This action is permanent and cannot be undone. To confirm,
                please type the event name below: <br />
                <strong className="text-gray-900 dark:text-white mt-2 block select-none px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  {event.title}
                </strong>
              </p>

              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type event name here..."
                disabled={isDeleting}
                className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-sm mb-6 outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl text-sm font-bold transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteInput !== event.title || isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={handleDelete}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Deleting...
                    </>
                  ) : (
                    "Delete Event"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
