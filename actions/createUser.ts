"use server";

import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { ActionResponse } from "@/type/actions";
import { SignupFormData } from "@/type/user";
import { db } from "@/lib";

export async function createUser(
  data: SignupFormData,
): Promise<ActionResponse> {
  const { email, password, name, clubId, designation, secretKey, role } = data;

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser)
      return { error: "A user with this email already exists." };

    // Set defaults based on the requested role
    let assignedRole = role || "SOCIETY_MEMBER";
    let assignedStatus: "PENDING" | "ACTIVE" = "PENDING";

    // Security Check
    if (assignedRole === "MODERATOR") {
      if (secretKey === process.env.MODERATOR_SECRET_KEY) {
        assignedStatus = "ACTIVE";
      } else {
        return { error: "Invalid Moderator Authorization Key." };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      clubId,
      designation, 
      role: assignedRole,
      status: assignedStatus,
    });

    // Just return success here! We handle login on the client.
    return { success: true };
  } catch (error: any | { message: string }) {
    console.error("DB_ERROR:", error);
    return { error: `${error?.message}` };
  }
}