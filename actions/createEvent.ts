"use server";

import { db } from "@/lib";
import { events, users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createEvent(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to create an event." };
    }

    // 1. Securely fetch the user to verify permissions and get their clubId
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (currentUser?.role !== "SOCIETY_HEAD" || !currentUser.clubId) {
      return { error: "Unauthorized: Only approved Society Heads can create events." };
    }

    // 2. Extract Required Fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDateStr = formData.get("startDate") as string;
    
    // 3. Extract Optional / Conditional Fields
    const endDateStr = formData.get("endDate") as string;
    const isOnline = formData.get("isOnline") === "true";
    const venue = formData.get("venue") as string;
    const meetingLink = formData.get("meetingLink") as string;
    const registrationLink = formData.get("registrationLink") as string;
    const registrationDeadlineStr = formData.get("registrationDeadline") as string;
    const maxCapacityStr = formData.get("maxCapacity") as string;
    
    // 4. Extract Image
    const coverImageFile = formData.get("coverImage") as File | null;
    let coverImageUrl: string | null = null;

    if (!title || !description || !startDateStr) {
      return { error: "Title, description, and start date are required." };
    }

    // --- CLOUDINARY UPLOAD LOGIC ---
    if (coverImageFile && coverImageFile.size > 0) {
      const arrayBuffer = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${coverImageFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_events", // Keeps it separate from clubs
      });

      coverImageUrl = uploadResponse.secure_url;
    }

    // Generate a URL-friendly slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    // 5. Insert into Database
    await db.insert(events).values({
      title,
      slug,
      description,
      coverImageUrl,
      startDate: new Date(startDateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      isOnline,
      venue: isOnline ? null : (venue || null),
      meetingLink: isOnline ? (meetingLink || null) : null,
      registrationLink: registrationLink || null,
      registrationDeadline: registrationDeadlineStr ? new Date(registrationDeadlineStr) : null,
      maxCapacity: maxCapacityStr ? parseInt(maxCapacityStr) : null,
      organizerId: currentUser.clubId, 
      status: "UPCOMING",
    });

    // 6. Refresh the cache
    revalidatePath("/dashboard");
    revalidatePath("/events");

    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { error: "An unexpected database error occurred." };
  }
}