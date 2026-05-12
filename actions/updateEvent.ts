// actions/updateEvent.ts

"use server";

import { db } from "@/lib";
import { events, users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateEvent(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to edit an event." };
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!currentUser?.clubId || (currentUser.role !== "SOCIETY_HEAD" && currentUser.role !== "SOCIETY_MEMBER")) {
      return { error: "Unauthorized: Only approved Core Team members can edit events." };
    }

    // Extract Required Fields
    const eventId = formData.get("eventId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDateStr = formData.get("startDate") as string;
    
    // Check if the event actually belongs to the user's club
    const existingEvent = await db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.organizerId, currentUser.clubId))
    });

    if (!existingEvent) {
      return { error: "Event not found or you do not have permission to edit it." };
    }
    
    // Extract Optional / Conditional Fields
    const endDateStr = formData.get("endDate") as string;
    const isOnline = formData.get("isOnline") === "true";
    const venue = formData.get("venue") as string;
    const meetingLink = formData.get("meetingLink") as string;
    const registrationLink = formData.get("registrationLink") as string;
    const registrationDeadlineStr = formData.get("registrationDeadline") as string;
    const maxCapacityStr = formData.get("maxCapacity") as string;
    
    // Image Handling
    const coverImageFile = formData.get("coverImage") as File | null;
    const isImageRemoved = formData.get("removeImage") === "true";
    let coverImageUrl = existingEvent.coverImageUrl; // Default to existing

    if (!title || !description || !startDateStr) {
      return { error: "Title, description, and start date are required." };
    }

    // --- CLOUDINARY UPLOAD LOGIC ---
    if (coverImageFile && coverImageFile.size > 0) {
      const arrayBuffer = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${coverImageFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_events",
      });

      coverImageUrl = uploadResponse.secure_url;
    } else if (isImageRemoved) {
      coverImageUrl = null;
    }

    // Update Database
    await db.update(events).set({
      title,
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
    }).where(eq(events.id, eventId));

    // Refresh caches
    revalidatePath("/dashboard");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { error: "An unexpected database error occurred." };
  }
}