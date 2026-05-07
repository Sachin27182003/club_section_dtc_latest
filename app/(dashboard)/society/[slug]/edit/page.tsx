import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib";
import { clubs, users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import EditSocietyForm from "./EditSocietyForm";

export default async function EditSocietyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  // Fetch Club Data
  const club = await db.query.clubs.findFirst({
    where: eq(clubs.slug, slug),
  });

  if (!club) notFound();

  // Verify User Authorization
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (currentUser?.clubId !== club.id) {
    redirect("/dashboard"); // Kick out unauthorized users
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 py-8 sm:py-12 transition-colors duration-300">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit {club.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Update your society's profile, description, logo, and social links.
        </p>
      </div>

      <EditSocietyForm club={club} />
    </div>
  );
}