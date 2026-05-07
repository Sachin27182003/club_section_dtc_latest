"use server";

import { clubs, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib";
import { auth } from "@/lib/db/auth";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { redirect } from "next/navigation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateSociety(clubId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to edit society details." };
  }

  // Verify the user is part of this club and is either a HEAD or MEMBER
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!currentUser || currentUser.clubId !== clubId) {
    return { error: "You do not have permission to edit this society." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "TECHNICAL" | "CULTURAL";
  const categoriesRaw = formData.get("categories") as string;

  const instagram = (formData.get("instagram") as string) || null;
  const linkedin = (formData.get("linkedin") as string) || null;
  const website = (formData.get("website") as string) || null;
  const youtube = (formData.get("youtube") as string) || null;
  const linktree = (formData.get("linktree") as string) || null;

  const logoFile = formData.get("logo") as File | null;
  
  const categories = categoriesRaw
    ? categoriesRaw.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  try {
    const updateData: any = {
      name,
      description,
      type,
      categories,
      instagram,
      linkedin,
      website,
      youtube,
      linktree,
    };

    // If a new image was uploaded, process it
    if (logoFile && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${logoFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_clubs",
      });

      updateData.logoUrl = uploadResponse.secure_url;
    }

    // Update the database
    await db.update(clubs).set(updateData).where(eq(clubs.id, clubId));

    revalidatePath("/dashboard");
    revalidatePath(`/society/${updateData.slug}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update society:", error);
    return { error: "An unexpected error occurred while updating." };
  }
}