// manageRequests.ts

"use server";

import { db } from "@/lib";
import { users, members } from "@/lib/db/schema"; // <-- NEW: Imported members schema
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/db/auth";

export async function updateRequestStatus(userId: string, action: "APPROVE" | "REJECT") {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    if (action === "APPROVE") {
      // 1. Fetch the user details to get their name, designation, and clubId
      const pendingUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!pendingUser || !pendingUser.clubId) {
        throw new Error("User or Club ID not found.");
      }

      // 2. Update their account status to ACTIVE
      await db
        .update(users)
        .set({ status: "ACTIVE" })
        .where(eq(users.id, userId));

      // 3. ✨ THE FIX: Insert them into the public members table ✨
      await db.insert(members).values({
        name: pendingUser.name || "Unknown Member",
        designation: pendingUser.designation || "Member",
        clubId: pendingUser.clubId,
      });

    } else {
      // If rejecting, just update the status to REJECTED
      await db
        .update(users)
        .set({ status: "REJECTED" })
        .where(eq(users.id, userId));
    }

    // Refresh the requests page data
    revalidatePath("/dashboard/requests");
    
    // NEW: Also refresh the main dashboard so the new member appears instantly in the bottom grid
    revalidatePath("/dashboard"); 

    return { success: true };
  } catch (error) {
    console.error("Failed to update request:", error);
    return { success: false, error: "Database update failed" };
  }
}