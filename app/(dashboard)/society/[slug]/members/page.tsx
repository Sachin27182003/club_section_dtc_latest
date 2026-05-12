// app/society/[slug]/members/page.tsx

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib";
import { clubs, members, users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import Link from "next/link";
import MemberManagerClient from "./MemberManagerClient";

export default async function ManageMembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 1. Fetch the club by slug
  const club = await db.query.clubs.findFirst({
    where: eq(clubs.slug, slug),
  });

  if (!club) {
    redirect("/dashboard");
  }

  // 2. Security Check: Is this user the Head of THIS specific club?
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (currentUser?.clubId !== club.id || currentUser?.role !== "SOCIETY_HEAD") {
    redirect("/dashboard");
  }

  // 3. Fetch existing core team members
  const clubMembers = await db.query.members.findMany({
    where: eq(members.clubId, club.id),
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-6">
        <Link 
          href="/dashboard" 
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Core Team
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Add or remove members from {club.name}'s public profile.
          </p>
        </div>
      </div>

      {/* Interactive Client Component */}
      <MemberManagerClient clubId={club.id} initialMembers={clubMembers} />
    </div>
  );
}