// ModeratorDashboard.tsx

import Link from "next/link";
import { eq, and } from "drizzle-orm";
// NEW: Imported passwordResetRequests
import { users, passwordResetRequests } from "@/lib/db/schema";
import { db } from "@/lib";
import { UserProfileBanner } from "./SharedComponents";

export default async function ModeratorDashboard({
  currentUser,
}: {
  currentUser: any;
}) {
  const allSocieties = await db.query.clubs.findMany({
    orderBy: (clubs, { asc }) => [asc(clubs.name)],
  });

  // 1. Fetch pending new account requests
  const pendingHeadRequests = await db.query.users.findMany({
    where: and(eq(users.status, "PENDING"), eq(users.role, "SOCIETY_HEAD")),
    columns: { id: true },
  });

  // 2. Fetch pending password reset requests for Society Heads
  const allPendingResets = await db.query.passwordResetRequests.findMany({
    where: eq(passwordResetRequests.status, "PENDING"),
    with: { user: true },
  });
  const pendingHeadResets = allPendingResets.filter(
    (r) => r.user?.role === "SOCIETY_HEAD",
  );

  // Combine both for the notification badge
  const pendingCount = pendingHeadRequests.length;
  const totalPendingCount = pendingCount + pendingHeadResets.length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      <UserProfileBanner user={currentUser} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Moderator Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and oversee all college societies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/requests"
            className="relative bg-amber-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors shadow-sm w-full sm:w-auto text-center"
          >
            Pending Requests
            {/* USE TOTAL COUNT HERE */}
            {totalPendingCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#121827]">
                {totalPendingCount > 99 ? "99+" : totalPendingCount}
              </span>
            )}
          </Link>
          <Link
            href="/society/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto text-center"
          >
            + Create Society
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allSocieties.map((club) => {
          const clubSlug =
            club.slug || club.name.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link
              href={`/society/${clubSlug}`}
              key={club.id}
              className="group h-full block"
            >
              <div className="bg-[#121827] border border-gray-800 group-hover:border-blue-500/50 rounded-xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-md transition-all duration-300 h-full">
                {club.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      club.logoUrl.startsWith("http")
                        ? club.logoUrl
                        : `/${club.logoUrl}`
                    }
                    alt={club.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shrink-0 ring-2 ring-gray-800 group-hover:ring-blue-500/30 transition-all"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 text-3xl font-bold shrink-0 ring-2 ring-gray-800 group-hover:ring-blue-500/30 transition-all">
                    {club.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[#3b82f6] text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                    {club.type} SOCIETY
                  </span>
                  <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1 group-hover:text-blue-100 transition-colors">
                    {club.name}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base line-clamp-2">
                    {club.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
