import { eq, and, gt, lt } from "drizzle-orm";
import { events } from "@/lib/db/schema";
import { db } from "@/lib";
import { getUserClub } from "@/actions/fetchSociety";
import { UserProfileBanner, EventCard } from "./SharedComponents";
import Link from "next/link";

export default async function MemberDashboard({ currentUser }: { currentUser: any }) {
  const rawClubResponse = await getUserClub(currentUser.id);

  if (!rawClubResponse || !("id" in rawClubResponse)) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
        <UserProfileBanner user={currentUser} />
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 transition-colors">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Society Associated</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">You are not a member of any society yet.</p>
        </div>
      </div>
    );
  }

  const myClub = rawClubResponse;
  const currentDate = new Date();

  const [upcomingEvents, previousEvents] = await Promise.all([
    db.query.events.findMany({
      where: and(eq(events.organizerId, myClub.id), gt(events.startDate, currentDate)),
      orderBy: (events, { asc }) => [asc(events.startDate)],
    }),
    db.query.events.findMany({
      where: and(eq(events.organizerId, myClub.id), lt(events.startDate, currentDate)),
      orderBy: (events, { desc }) => [desc(events.startDate)],
    })
  ]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12 transition-colors">
      <UserProfileBanner user={currentUser} />

      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full">
          {myClub.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={myClub.logoUrl} alt={myClub.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold shrink-0">
              {myClub.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1 block">{myClub.type} Society</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{myClub.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 max-w-2xl text-sm sm:text-base">{myClub.description}</p>
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 pt-6 lg:pt-0 border-t border-gray-100 dark:border-gray-800 lg:border-0 shrink-0">
          <Link
            href={`/society/${myClub.slug}/edit`}
            className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm w-full sm:w-auto"
          >
            Edit Society
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No upcoming events.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Previous Events</h2>
        {previousEvents.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No past events to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 opacity-90 hover:opacity-100 transition-opacity">
            {previousEvents.map((event) => <EventCard key={event.id} event={event} isPast />)}
          </div>
        )}
      </section>
    </div>
  );
}