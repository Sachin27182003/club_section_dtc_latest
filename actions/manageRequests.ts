"use server";

import { db } from "@/lib";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/db/auth";

export async function updateRequestStatus(userId: string, action: "APPROVE" | "REJECT") {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const newStatus = action === "APPROVE" ? "ACTIVE" : "REJECTED";

  try {
    await db
      .update(users)
      .set({ status: newStatus })
      .where(eq(users.id, userId));

    // Refresh the page data so the UI updates instantly
    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to update request:", error);
    return { success: false, error: "Database update failed" };
  }
}