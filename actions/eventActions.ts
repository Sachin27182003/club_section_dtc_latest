// eventActions.ts

"use server";

import { eq, and, gt, lt, desc } from "drizzle-orm";
import { events, users } from "@/lib/db/schema";
import { db } from "@/lib";

// ==========================================
// 1. Fetch ALL Events (For Homepage)
// ==========================================
export async function getAllEvents() {
  try {
    const allEvents = await db.query.events.findMany({
      // We use "with" to join the organizer (club) details
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

// ==========================================
// 2. Fetch Dashboard Data (For Society Head)
// ==========================================
export async function getDashboardData(clubId: string) {
  const currentDate = new Date();

  const [rawUpcomingEvents, rawPreviousEvents, pendingMemberRequests] = await Promise.all([
    db.query.events.findMany({
      where: and(
        eq(events.organizerId, clubId),
        gt(events.startDate, currentDate),
      ),
      orderBy: (events, { asc }) => [asc(events.startDate)],
    }),
    db.query.events.findMany({
      where: and(
        eq(events.organizerId, clubId),
        lt(events.startDate, currentDate),
      ),
      orderBy: (events, { desc }) => [desc(events.startDate)],
    }),
    // @ts-ignore
    db.query.users.findMany({
      where: and(eq(users.status, "PENDING"), eq(users.clubId, clubId)),
      columns: { id: true },
    }),
  ]);

  return { rawUpcomingEvents, rawPreviousEvents, pendingMemberRequests };
}