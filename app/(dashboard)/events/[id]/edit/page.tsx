// app/events/[id]/edit/page.tsx

import { redirect } from "next/navigation";
import { db } from "@/lib";
import { events, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/db/auth";
import EditEventClient from "./EditEventClient";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Check user permissions
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!currentUser?.clubId || (currentUser.role !== "SOCIETY_HEAD" && currentUser.role !== "SOCIETY_MEMBER")) {
    redirect("/dashboard");
  }

  // Fetch the event
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, id), eq(events.organizerId, currentUser.clubId)),
  });

  if (!event) {
    redirect("/dashboard");
  }

  return <EditEventClient initialData={event} />;
}