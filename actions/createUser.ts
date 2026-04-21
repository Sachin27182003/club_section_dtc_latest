"use server";

import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib";
import { ActionResponse } from "@/type/actions";
import { SignupFormData } from "@/type/user";
import { signIn } from "@/lib/auth";

// 2. Explicitly type the return value as Promise<ActionResponse>
export async function createUser(
  data: SignupFormData,
): Promise<ActionResponse> {
  const { email, password, name, clubId, secretKey } = data;

  try {
    // 3. Check if the email is already in use
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser)
      return { error: "A user with this email already exists." };

    // 4. The Security Check & Role Assignment
    let assignedRole: "CLUB_ADMIN" | "MODERATOR" = "CLUB_ADMIN";
    let assignedStatus: "PENDING" | "ACTIVE" = "PENDING";

    // If the user tried to submit a secret key, verify it!
    if (secretKey) {
      if (secretKey === process.env.MODERATOR_SECRET_KEY) {
        assignedRole = "MODERATOR";
        assignedStatus = "ACTIVE"; // Moderators skip the waiting room
      } else {
        // If they guess the key wrong, immediately reject the signup
        return { error: "Invalid Moderator Authorization Key." };
      }
    }

    // 5. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Insert the user into the database
    // Drizzle will automatically type-check this payload against typeof users.$inferInsert!
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword, // Hashed password goes to DB
      clubId,
      role: assignedRole,
      status: assignedStatus,
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    return { success: true };
  } catch (error) {
    console.error("DB_ERROR:", error);
    return { error: `Something went wrong while creating the account.`, };
  }
}
