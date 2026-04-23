"use client"

import React, { useRef } from "react";
import { Reveal } from "./Reveal";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { EventCard } from "./EventCard";

interface PastEventsProps {
  events: any[];
}

function PastEvents({ events }: PastEventsProps) {
  const pastEvents = events.filter(
    (event) => new Date(event.startDate) < new Date(),
  );

  if (pastEvents.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Reveal>
        <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-neutral-200">
          Pasts Events ({pastEvents.length})
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pastEvents.map((event, i) => (
          <Reveal key={event.id} delay={i * 100}>
            <EventCard event={event} isPast={true} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default PastEvents;