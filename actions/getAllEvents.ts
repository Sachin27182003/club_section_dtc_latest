"use server";

import { db } from "@/lib";
import { events } from "@/lib/db/schema";
import { lt, desc } from "drizzle-orm";

export async function getAllEvents() {
  try {
    const allEvents = await db.query.events.findMany({
      // We "with" to join the organizer (club) details
      with: {
        organizer: true,
      },
      orderBy: [desc(events.startDate)],
    });
    return allEvents;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}