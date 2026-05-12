// actions/deleteEvent.ts

"use server";

import { db } from "@/lib";
import { events, users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to delete an event." };
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // Check permissions
    if (!currentUser?.clubId || (currentUser.role !== "SOCIETY_HEAD" && currentUser.role !== "SOCIETY_MEMBER")) {
      return { error: "Unauthorized: Only approved Core Team members can delete events." };
    }

    // Verify the event belongs to this user's club before deleting
    const existingEvent = await db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.organizerId, currentUser.clubId))
    });

    if (!existingEvent) {
      return { error: "Event not found or you do not have permission to delete it." };
    }

    // Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    // Refresh caches
    revalidatePath("/dashboard");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { error: "An unexpected database error occurred." };
  }
}