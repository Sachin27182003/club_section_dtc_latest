import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { db } from "@/lib";
import { redirect } from "next/navigation";
import { auth } from "@/lib/db/auth";
import ModeratorDashboard from "./ModeratorDashboard";
import SocietyHeadDashboard from "./SocietyHeadDashboard";
import MemberDashboard from "./MemberDashboard";

// Import your newly separated dashboard components

export default async function DashboardPage() {
  const session = await auth();

  // Basic security: if not logged in, redirect to sign in
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 1. FETCH CURRENT USER STATUS
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  const isModerator = currentUser?.role?.toUpperCase() === "MODERATOR";
  const isSocietyHead = currentUser?.role?.toUpperCase() === "SOCIETY_HEAD";

  // 2A. CHECK FOR PENDING APPROVAL
  if (currentUser?.status === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500 transition-colors">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Account Pending Approval
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg text-base sm:text-lg leading-relaxed">
          {isSocietyHead
            ? "Your request to register as a Society Head is currently under review. Please contact your HOD or the College Dean to expedite the approval process."
            : "Your membership request is currently pending. You will gain access to the dashboard once the Society Head approves your account."}
        </p>
      </div>
    );
  }

  // 2B. CHECK FOR REJECTED STATUS
  if (currentUser?.status === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500 transition-colors">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Account Request Declined
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg text-base sm:text-lg leading-relaxed">
          {isSocietyHead
            ? "Your request to register as a Society Head has been declined by the administration. Please reach out to your HOD or the College Dean for further details."
            : "Your request to join this society has been declined by the Society Head."}
        </p>
      </div>
    );
  }

  // 3. ROUTE TO THE CORRECT DASHBOARD ROLE
  if (isModerator) {
    return <ModeratorDashboard currentUser={currentUser} />;
  }

  if (isSocietyHead) {
    return <SocietyHeadDashboard currentUser={currentUser} />;
  }

  // Default fallback for general members
  return <MemberDashboard currentUser={currentUser} />;
}
