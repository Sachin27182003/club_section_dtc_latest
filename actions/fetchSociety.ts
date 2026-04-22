// lib/queries/fetchSociety.ts
import { eq } from "drizzle-orm";
import { users, clubs } from "@/lib/db/schema";
import { db } from "@/lib";

export async function getUserClub(userId: string) {
  try {
    // 1. Fetch the user to get their associated clubId
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // If no user is found or they don't have a club assigned, return null
    if (!currentUser || !currentUser.clubId) {
      return null;
    }

    // 2. Fetch the club details using the user's clubId
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, currentUser.clubId),
    });

    return club || null;
  } catch (error: any | { message: string }) {
    console.error("Error fetching user club:", error);
    return { error: error?.message };
  }
}
