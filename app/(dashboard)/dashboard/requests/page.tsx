// requests/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib";
import { users, passwordResetRequests } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { getUserClub } from "@/actions/fetchSociety";
import RequestActionButtons from "./RequestActionButtons";
import ResetActionButtons from "./ResetActionButtons"; // NEW IMPORT

export default async function RequestsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 1. Get the current logged-in user
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  // Basic security: Kick out regular members or pending users
  if (
    !currentUser ||
    !["MODERATOR", "SOCIETY_HEAD"].includes(currentUser.role)
  ) {
    redirect("/dashboard");
  }

  let pendingRequests: any[] = [];
  let pendingResets: any[] = []; // NEW: Array for reset requests
  let pageTitle = "";
  let pageDescription = "";

  // 2. Fetch logic based on role
  if (currentUser.role === "MODERATOR") {
    pageTitle = "Society Head Requests";
    pageDescription =
      "Manage new society approvals and password resets for Society Heads.";

    // A. Fetch pending new accounts
    pendingRequests = await db.query.users.findMany({
      where: and(eq(users.status, "PENDING"), eq(users.role, "SOCIETY_HEAD")),
    });

    // B. Fetch pending password resets (with the attached user data)
    const allPendingResets = await db.query.passwordResetRequests.findMany({
      where: eq(passwordResetRequests.status, "PENDING"),
      with: { user: true },
    });
    // Moderators only see reset requests from Society Heads
    pendingResets = allPendingResets.filter(
      (r) => r.user.role === "SOCIETY_HEAD",
    );
  } else if (currentUser.role === "SOCIETY_HEAD") {
    pageTitle = "Member Requests";
    pageDescription =
      "Manage new member approvals and password resets for your society.";

    const myClub = await getUserClub(currentUser.id);

    if (!myClub || !("id" in myClub)) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold">
            You need to create a society first.
          </h1>
          <Link
            href="/dashboard"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Go back to Dashboard
          </Link>
        </div>
      );
    }

    // A. Fetch pending new accounts for this club
    pendingRequests = await db.query.users.findMany({
      where: and(eq(users.status, "PENDING"), eq(users.clubId, myClub.id)),
    });

    // B. Fetch pending password resets
    const allPendingResets = await db.query.passwordResetRequests.findMany({
      where: eq(passwordResetRequests.status, "PENDING"),
      with: { user: true },
    });
    // Heads only see reset requests from Members in their specific club
    pendingResets = allPendingResets.filter(
      (r) => r.user.clubId === myClub.id && r.user.role === "SOCIETY_MEMBER",
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard"
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{pageDescription}</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: NEW ACCOUNT APPROVALS */}
      {/* ========================================================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            New Account Approvals
          </h2>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-xs">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No new account requests at this time.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((requestUser) => (
              <div
                key={requestUser.id}
                className="bg-white dark:bg-[#121827] border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0">
                    {requestUser.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {requestUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {requestUser.email}
                    </p>
                    <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 uppercase tracking-wider">
                      {requestUser.role.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <RequestActionButtons userId={requestUser.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: PASSWORD RESET REQUESTS */}
      {/* ========================================================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Password Reset Requests
          </h2>
          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg font-medium text-xs">
            {pendingResets.length} Pending
          </span>
        </div>

        {pendingResets.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No password reset requests at this time.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingResets.map((resetObj) => (
              <div
                key={resetObj.id}
                className="bg-white dark:bg-[#121827] border border-amber-200 dark:border-amber-900/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {resetObj.user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resetObj.user.email}
                    </p>
                    <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                      Requires New Password
                    </span>
                  </div>
                </div>

                <ResetActionButtons
                  requestId={resetObj.id}
                  userId={resetObj.user.id}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
