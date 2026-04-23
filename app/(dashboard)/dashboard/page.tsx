import Link from "next/link";
import { eq, and, gt, lt } from "drizzle-orm";
import { events, users } from "@/lib/db/schema";
import { db } from "@/lib";
import { redirect } from "next/navigation";
import { getUserClub } from "@/actions/fetchSociety";
import { auth } from "@/lib/db/auth";

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
          {currentUser.role === "SOCIETY_HEAD"
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
          {currentUser.role === "SOCIETY_HEAD"
            ? "Your request to register as a Society Head has been declined by the administration. Please reach out to your HOD or the College Dean for further details."
            : "Your request to join this society has been declined by the Society Head."}
        </p>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 3. THE MODERATOR DASHBOARD (Shows all societies like your image)
  // ------------------------------------------------------------------
  if (currentUser?.role === "MODERATOR") {
    // Fetch all clubs for the moderator
    const allSocieties = await db.query.clubs.findMany({
      orderBy: (clubs, { asc }) => [asc(clubs.name)],
    });

    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Moderator Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and oversee all college societies.
            </p>
          </div>
          <Link
            href="/society/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Create Society
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allSocieties.map((club) => {
            const clubSlug =
              club.slug || club.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                href={`/clubs/${clubSlug}`}
                key={club.id}
                className="group h-full block"
              >
                {/* 2. ADDED: `h-full` to the inner div so the background stretches */}
                <div className="bg-[#121827] border border-gray-800 group-hover:border-blue-500/50 rounded-xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-md transition-all duration-300 h-full">
                  {/* Logo */}
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

                  {/* Text Content */}
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
  // ------------------------------------------------------------------

  // 4. Fetch User's Club using the isolated function (For normal members/heads)
  const rawClubResponse = await getUserClub(session.user.id);

  // FIX FOR TYPESCRIPT ERROR: Narrow the type by checking if "id" exists
  if (!rawClubResponse || !("id" in rawClubResponse)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 transition-colors">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Society Associated
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          You are not a member or admin of any society yet. Create a new society
          to start managing events and members.
        </p>
        {currentUser?.role === "SOCIETY_HEAD" && (
          <Link
            href="/society/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            + Create New Society
          </Link>
        )}
      </div>
    );
  }

  const myClub = rawClubResponse;

  // 5. IF THEY HAVE A CLUB: Fetch Events
  const currentDate = new Date();

  const upcomingEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, myClub.id),
      gt(events.startDate, currentDate),
    ),
    orderBy: (events, { asc }) => [asc(events.startDate)],
  });

  const previousEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, myClub.id),
      lt(events.startDate, currentDate),
    ),
    orderBy: (events, { desc }) => [desc(events.startDate)],
  });

  // 6. Render the Regular Member/Head Dashboard
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12 transition-colors">
      {/* Society Header */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 transition-colors">
        {myClub.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={myClub.logoUrl}
            alt={myClub.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold shrink-0">
            {myClub.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1 block">
            {myClub.type} Society
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {myClub.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 max-w-2xl text-sm sm:text-base">
            {myClub.description}
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Upcoming Events
          </h2>
          {currentUser?.role === "SOCIETY_HEAD" && (
            <Link
              href="/events/new"
              className="text-xs sm:text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 sm:px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              + New Event
            </Link>
          )}
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No upcoming events. Time to plan something exciting!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Previous Events Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Previous Events
        </h2>
        {previousEvents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No past events to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 opacity-90 hover:opacity-100 transition-opacity">
            {previousEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable Event Card Component
function EventCard({
  event,
  isPast = false,
}: {
  event: any;
  isPast?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {event.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.coverImageUrl}
          alt={event.title}
          className="w-full h-32 sm:h-40 object-cover"
        />
      ) : (
        <div className="w-full h-32 sm:h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
          No Cover Image
        </div>
      )}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${isPast ? "bg-green-500 dark:bg-green-700 text-neutral-800 dark:text-neutral-100" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}
          >
            {isPast ? "Completed" : event.status}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(event.startDate).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>
        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <svg
            className="w-4 h-4 mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {event.isOnline ? "Online Meeting" : event.venue || "TBA"}
          </span>
        </div>
      </div>
    </div>
  );
}

//  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {allSocieties.map((club) => {
//             const clubSlug =
//               club.slug || club.name.toLowerCase().replace(/\s+/g, "-");
//             return (
//               <Link href={`/clubs/${clubSlug}`} key={club.id} className="group">
//                 {/* Replicating the exact card from your image */}
//                 <div className="bg-[#121827] border border-gray-800 group-hover:border-blue-500/50 rounded-xl p-5 sm:p-6 flex items-center gap-5 sm:gap-6 shadow-md transition-all duration-300">
//                   {/* Logo */}
//                   {club.logoUrl ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img
//                       src={
//                         club.logoUrl.startsWith("http")
//                           ? club.logoUrl
//                           : `/${club.logoUrl}`
//                       }
//                       alt={club.name}
//                       className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shrink-0 ring-2 ring-gray-800 group-hover:ring-blue-500/30 transition-all"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 text-3xl font-bold shrink-0 ring-2 ring-gray-800 group-hover:ring-blue-500/30 transition-all">
//                       {club.name.charAt(0)}
//                     </div>
//                   )}

//                   {/* Text Content */}
//                   <div className="flex flex-col">
//                     <span className="text-[#3b82f6] text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
//                       {club.type} SOCIETY
//                     </span>
//                     <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1 group-hover:text-blue-100 transition-colors">
//                       {club.name}
//                     </h2>
//                     <p className="text-gray-400 text-sm sm:text-base line-clamp-2">
//                       {club.description}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
