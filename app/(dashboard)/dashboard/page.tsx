import Link from "next/link";
import { eq, and, gt, lt } from "drizzle-orm";
import { events, users } from "@/lib/db/schema";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserClub } from "@/actions/fetchSociety";

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
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          {/* Hourglass Icon */}
          <svg
            className="w-10 h-10 text-amber-600"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Account Pending Approval
        </h1>
        <p className="text-gray-500 mb-8 max-w-lg text-lg leading-relaxed">
          {currentUser.role === "SOCIETY_HEAD"
            ? "Your request to register as a Society Head is currently under review. Please contact your HOD or the College Dean to expedite the approval process."
            : "Your membership request is currently pending. You will gain access to the dashboard once the Society Head approves your account."}
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 font-medium rounded-full border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
          Status: Review in Progress
        </div>
      </div>
    );
  }

  // 2B. CHECK FOR REJECTED STATUS
  if (currentUser?.status === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          {/* Warning/Cross Icon */}
          <svg
            className="w-10 h-10 text-red-600"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Account Request Declined
        </h1>
        <p className="text-gray-500 mb-8 max-w-lg text-lg leading-relaxed">
          {currentUser.role === "SOCIETY_HEAD"
            ? "Your request to register as a Society Head has been declined by the administration. Please reach out to your HOD or the College Dean for further details."
            : "Your request to join this society has been declined by the Society Head."}
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 font-medium rounded-full border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
          Status: Rejected
        </div>
      </div>
    );
  }

  // 3. Fetch User's Club using the isolated function
  const myClub = await getUserClub(session.user.id);

  // 4. IF NO CLUB: Show the Empty State (Only Society Heads can create clubs)
  if (!myClub) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          No Society Associated
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          You are not a member or admin of any society yet. Create a new society
          to start managing events and members.
        </p>

        {/* Hide the Create button if they are just a member */}
        {currentUser?.role === "SOCIETY_HEAD" && (
          <Link
            href="/society/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Create New Society
          </Link>
        )}
      </div>
    );
  }

  // 5. IF THEY HAVE A CLUB: Fetch Events
  const currentDate = new Date();

  // Fetch upcoming events (StartDate > Now)
  const upcomingEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, myClub.id),
      gt(events.startDate, currentDate),
    ),
    orderBy: (events, { asc }) => [asc(events.startDate)],
  });

  // Fetch previous events (StartDate < Now)
  const previousEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, myClub.id),
      lt(events.startDate, currentDate),
    ),
    orderBy: (events, { desc }) => [desc(events.startDate)],
  });

  // 6. Render the Dashboard
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Society Header */}
      <section className="bg-white rounded-xl border p-8 shadow-sm flex items-center gap-6">
        {myClub.logoUrl ? (
          <></>
        ) : (
          //   <img
          //     src={myClub.logoUrl}
          //     alt={myClub.name}
          //     className="w-24 h-24 rounded-full object-cover border"
          //   />
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {myClub.name.charAt(0)}
          </div>
        )}
        <div>
          <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-1 block">
            {myClub.type} Society
          </span>
          <h1 className="text-3xl font-bold text-gray-900">{myClub.name}</h1>
          <p className="text-gray-500 mt-2 line-clamp-2 max-w-2xl">
            {myClub.description}
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          {currentUser?.role === "SOCIETY_HEAD" && (
            <Link
              href="/events/new"
              className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              + New Event
            </Link>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No upcoming events. Time to plan something exciting!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Previous Events Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Previous Events
        </h2>
        {previousEvents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No past events to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
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
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {event.coverImageUrl ? (
        <></>
      ) : (
        // <img
        //   src={event.coverImageUrl}
        //   alt={event.title}
        //   className="w-full h-40 object-cover"
        // />
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
          No Cover Image
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isPast
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isPast ? "Completed" : event.status}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(event.startDate).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
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
          {event.isOnline ? "Online Meeting" : event.venue || "TBA"}
        </div>
      </div>
    </div>
  );
}
