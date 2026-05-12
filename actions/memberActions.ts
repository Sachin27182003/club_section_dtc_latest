// actions/memberActions.ts

"use server";

import { db } from "@/lib";
import { members, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "dtc_members",
      });

      imageUrl = uploadResponse.secure_url;
    }

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

    // 1. Find the new president's user account
    const newPresidentUser = await db.query.users.findFirst({
      where: eq(users.email, newPresidentEmail),
    });

    if (!newPresidentUser) {
      return { error: "The new president must create an account first with that email." };
    }

    // 2. DELETE the appointed member from the members table 
    // (They are now the Society Head, they shouldn't be duplicated in the list)
    await db.delete(members).where(eq(members.id, targetMemberId));

    // 3. Promote the new user to SOCIETY_HEAD
    await db.update(users)
      .set({ role: "SOCIETY_HEAD", clubId: clubId, status: "ACTIVE" })
      .where(eq(users.id, newPresidentUser.id));

    // 4. Handle the Current Head's (Your) Account
    if (headAction === "DELETE") {
      await db.delete(users).where(eq(users.id, currentUser.id));
    } else if (headAction === "DEMOTE") {
      // ADD YOU to the core team members table
      await db.insert(members).values({
        clubId: clubId,
        name: currentUser.name || "Former Head",
        designation: headNewDesignation || "Member",
        imageUrl: null, 
      });

      // Update your User role
      await db.update(users)
        .set({ 
          role: "SOCIETY_MEMBER", 
          designation: headNewDesignation || "Member" 
        })
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