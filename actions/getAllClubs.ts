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