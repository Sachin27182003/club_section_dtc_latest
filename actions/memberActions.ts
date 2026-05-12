// actions/memberActions.ts

"use server";

import { db } from "@/lib";
import { members, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/db/auth";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addCoreTeamMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const clubId = formData.get("clubId") as string;
  const name = formData.get("name") as string;
  const designation = formData.get("designation") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | null = null;

  try {
    // --- CLOUDINARY UPLOAD LOGIC ---
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_members",
      });

      imageUrl = uploadResponse.secure_url;
    }
    // -----------------------------------

    await db.insert(members).values({
      clubId,
      name,
      designation,
      imageUrl,
    });
    
    revalidatePath(`/dashboard`);
    revalidatePath(`/society`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add member:", error);
    return { error: "Database error. Failed to add member." };
  }
}

export async function deleteCoreTeamMember(memberId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await db.delete(members).where(eq(members.id, memberId));
    
    revalidatePath(`/dashboard`);
    revalidatePath(`/society`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete member:", error);
    return { error: "Database error. Failed to delete member." };
  }
}

// NEW: Handle transferring the presidency
export async function transferPresidency(
  clubId: string,
  targetMemberId: string,
  newPresidentEmail: string,
  headAction: "DEMOTE" | "DELETE",
  headNewDesignation?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (currentUser?.clubId !== clubId || currentUser?.role !== "SOCIETY_HEAD") {
      return { error: "Unauthorized. Only the current Society Head can do this." };
    }

    // 1. Find the new president's user account (they MUST have signed up first)
    const newPresidentUser = await db.query.users.findFirst({
      where: eq(users.email, newPresidentEmail),
    });

    if (!newPresidentUser) {
      return { error: "The new president must create an account on the platform first using that email address." };
    }

    // 2. Update the target member's public profile designation
    await db.update(members)
      .set({ designation: "President" })
      .where(eq(members.id, targetMemberId));

    // 3. Promote the new user to SOCIETY_HEAD and assign them to this club
    await db.update(users)
      .set({ role: "SOCIETY_HEAD", clubId: clubId, status: "ACTIVE" })
      .where(eq(users.id, newPresidentUser.id));

    // 4. Handle the Current Head's Account
    if (headAction === "DELETE") {
      // Delete the current head's account entirely
      await db.delete(users).where(eq(users.id, currentUser.id));
    } else if (headAction === "DEMOTE") {
      // Demote current head to a regular member with a new designation
      await db.update(users)
        .set({ role: "SOCIETY_MEMBER", designation: headNewDesignation || "Member" })
        .where(eq(users.id, currentUser.id));
    }

    revalidatePath("/dashboard");
    revalidatePath(`/society`);
    return { success: true };
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: "Failed to transfer presidency. Please try again." };
  }
}