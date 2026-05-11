// actions/fetchMembers.ts
"use server"

import { db } from "@/lib";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getClubMembers(clubId: string) {
  try {
    const clubMembers = await db.query.members.findMany({
      where: eq(members.clubId, clubId),
      // Optional: You can add orderBy here if you want to sort by name or created date
    });
    return clubMembers;
  } catch (error) {
    console.error("Failed to fetch club members:", error);
    return [];
  }
}