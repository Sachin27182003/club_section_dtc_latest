"use server";

import { db } from "@/lib";
import { clubs } from "@/lib/db/schema"; // Adjust this import based on your actual schema file

export async function getAllClubs() {
  try {
    // Fetch every club/society from the database
    const allClubs = await db.query.clubs.findMany();
    return allClubs;
  } catch (error) {
    console.error("Failed to fetch clubs from database:", error);
    return []; // Return an empty array on error so the UI doesn't break
  }
}

export async function getClubsForSignup() {
  try {
    const allClubs = await db.query.clubs.findMany({
      columns: {
        id: true,
        name: true,
      },
      orderBy: (clubs, { asc }) => [asc(clubs.name)],
    });
    return allClubs;
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    return [];
  }
}