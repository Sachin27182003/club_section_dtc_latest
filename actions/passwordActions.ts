// actions/passwordActions.ts
"use server"

import { db } from "@/lib"; // Update this path if your db instance is exported from "@/lib/db" instead
import { users, passwordResetRequests } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs"; // Assuming you use bcryptjs for hashing

// 1. Called from the /forgot-password page
export async function requestPasswordReset(email: string) {
  try {
    // Find the user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      // For security, we don't say "User not found". We just return success.
      return { success: true };
    }

    // Check if they already have a pending request
    const existingRequest = await db.query.passwordResetRequests.findFirst({
      where: and(
        eq(passwordResetRequests.userId, existingUser.id),
        eq(passwordResetRequests.status, "PENDING")
      ),
    });

    if (existingRequest) {
      return { success: true }; // Silently succeed to avoid spamming the DB
    }

    // Create the pending request
    await db.insert(passwordResetRequests).values({
      userId: existingUser.id,
      status: "PENDING",
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to request reset:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

// 2. Called from the Dashboard to resolve a request
export async function resolvePasswordReset(requestId: string, userId: string, newPasswordRaw: string) {
  try {
    // Hash the new temporary password
    const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

    // Update the user's password
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    // Mark the request as RESOLVED
    await db.update(passwordResetRequests)
      .set({ status: "RESOLVED" })
      .where(eq(passwordResetRequests.id, requestId));

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Failed to resolve reset:", error);
    return { error: "Failed to reset password." };
  }
}

// NEW: For logged-in users changing their own password
export async function changeOwnPassword(userId: string, currentPasswordRaw: string, newPasswordRaw: string) {
  try {
    // 1. Get the user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { error: "User not found." };
    }

    // 2. Verify their current password is correct before allowing a change
    const isPasswordValid = await bcrypt.compare(currentPasswordRaw, user.password);
    
    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    // 3. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPasswordRaw, 10);

    // 4. Save to database
    await db.update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, userId));

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { error: "Something went wrong." };
  }
}