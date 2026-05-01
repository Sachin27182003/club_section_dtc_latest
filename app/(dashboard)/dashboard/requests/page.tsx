import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { getUserClub } from "@/actions/fetchSociety";
import RequestActionButtons from "./RequestActionButtons";

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
  if (!currentUser || !["MODERATOR", "SOCIETY_HEAD"].includes(currentUser.role)) {
    redirect("/dashboard");
  }

  let pendingRequests: any[] = [];
  let pageTitle = "";
  let pageDescription = "";

  // 2. Fetch logic based on role
  if (currentUser.role === "MODERATOR") {
    pageTitle = "Society Head Requests";
    pageDescription = "Approve or reject requests from users wanting to create and manage a society.";
    
    // Moderators see pending Society Heads
    pendingRequests = await db.query.users.findMany({
      where: and(
        eq(users.status, "PENDING"),
        eq(users.role, "SOCIETY_HEAD")
      ),
    });
  } 
  else if (currentUser.role === "SOCIETY_HEAD") {
    pageTitle = "Member Requests";
    pageDescription = "Approve or reject students requesting to join your society.";
    
    const myClub = await getUserClub(currentUser.id);
    
    if (!myClub || !("id" in myClub)) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold">You need to create a society first.</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">Go back to Dashboard</Link>
        </div>
      );
    }

    // Society Heads see pending Members for THEIR club
    // ASSUMPTION: Your users table has a `clubId` to track which club they applied to.
    pendingRequests = await db.query.users.findMany({
      where: and(
        eq(users.status, "PENDING"),
        eq(users.clubId, myClub.id) 
      ),
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard" 
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Pending Requests
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {pageDescription}
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm">
          {pendingRequests.length} Pending
        </div>
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">All Caught Up!</h3>
          <p className="text-gray-500 dark:text-gray-400">There are no pending requests at this time.</p>
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
                  <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                    {requestUser.role.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Client Component for Interactive Buttons */}
              <RequestActionButtons userId={requestUser.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}