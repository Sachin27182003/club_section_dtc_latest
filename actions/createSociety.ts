// actions/createSociety.ts

"use server";

import { clubs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib"; // Adjust based on your setup
import { auth } from "@/lib/db/auth";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createSociety(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to create a society." };
  }

  // 1. Extract and format data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "TECHNICAL" | "CULTURAL";
  const categoriesRaw = formData.get("categories") as string;

  // Social links
  const instagram = (formData.get("instagram") as string) || null;
  const linkedin = (formData.get("linkedin") as string) || null;
  const website = (formData.get("website") as string) || null;
  const youtube = (formData.get("youtube") as string) || null;
  const linktree = (formData.get("linktree") as string) || null;

  // 2. Extract Image File
  const logoFile = formData.get("logo") as File | null;
  let logoUrl: string | null = null;

  // 3. Convert comma-separated categories into a JSON array
  const categories = categoriesRaw
    ? categoriesRaw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  // 4. Generate a safe URL slug
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // 5. Check if a society with this name or slug already exists
    const existingClub = await db.query.clubs.findFirst({
      where: eq(clubs.slug, slug),
    });

    if (existingClub) {
      return { error: "A society with this name already exists." };
    }

    // --- NEW: CLOUDINARY UPLOAD LOGIC ---
    if (logoFile && logoFile.size > 0) {
      // Convert the file to a base64 string that Cloudinary can read
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${logoFile.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_clubs", // Keeps your Cloudinary dashboard organized
      });

      logoUrl = uploadResponse.secure_url;
    }
    // -----------------------------------

    const newClubId = crypto.randomUUID();

    // 6. Insert the new Club into the database (Now with logoUrl)
    await db.insert(clubs).values({
      id: newClubId,
      name,
      slug,
      description,
      type,
      logoUrl, // SAVED HERE
      categories,
      instagram,
      linkedin,
      website,
      youtube,
      linktree,
    });

    // 7. Update the User's profile to link them to this new club
    await db
      .update(users)
      .set({ clubId: newClubId })
      .where(eq(users.id, session.user.id));

    // 8. Refresh the dashboard
    revalidatePath("/dashboard");

    return { success: true, clubId: newClubId };
  } catch (error) {
    console.error("Failed to create society:", error);
    return {
      error: "An unexpected error occurred while creating the society.",
    };
  }
}
