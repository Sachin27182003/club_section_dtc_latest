"use client";

import React from "react";
import { Reveal } from "./Reveal";
import { EventCard } from "./EventCard"; // Import the new card

interface UpcomingEventsProps {
  events: any[];
}

function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = events.filter(
    (event) => new Date(event.startDate) >= new Date(),
  );

  if (upcomingEvents.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Reveal>
        <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-neutral-200">
          Upcoming Events ({upcomingEvents.length})
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {upcomingEvents.map((event, i) => (
          <Reveal key={event.id} delay={i * 100}>
            <EventCard event={event} isPast={false} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default UpcomingEvents;