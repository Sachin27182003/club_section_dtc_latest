import { notFound } from "next/navigation";
import { eq, and, gt, lt } from "drizzle-orm";
import { db } from "@/lib";
import { clubs, members, events, users } from "@/lib/db/schema";
import UpcomingEvents from "@/app/_components/UpcomingEvents";
import PastEvents from "@/app/_components/PastEvents";

export default async function SocietyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the specific club by its slug
  const club = await db.query.clubs.findFirst({
    where: eq(clubs.slug, slug),
  });

  // If the club doesn't exist, show a 404 page
  if (!club) {
    notFound();
  }

  // 2. Fetch the club's members
  const clubMembers = await db.query.members.findMany({
    where: eq(members.clubId, club.id),
  });

  // NEW: Fetch the Society Head's information
  const societyHead = await db.query.users.findFirst({
    where: and(
      eq(users.clubId, club.id),
      eq(users.role, "SOCIETY_HEAD"),
      eq(users.status, "ACTIVE"), // Ensure we only show approved heads
    ),
  });

  // 3. Fetch the club's events WITH ORGANIZER RELATION
  const currentDate = new Date();

  const upcomingEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, club.id),
      gt(events.startDate, currentDate),
    ),
    orderBy: (events, { asc }) => [asc(events.startDate)],
    with: {
      organizer: true,
    },
  });

  const previousEvents = await db.query.events.findMany({
    where: and(
      eq(events.organizerId, club.id),
      lt(events.startDate, currentDate),
    ),
    orderBy: (events, { desc }) => [desc(events.startDate)],
    with: {
      organizer: true,
    },
  });

  // Parse categories safely
  let parsedCategories: string[] = [];
  try {
    if (Array.isArray(club.categories)) {
      parsedCategories = club.categories;
    } else if (typeof club.categories === "string") {
      parsedCategories = JSON.parse(club.categories);
    }
  } catch (e) {
    console.error("Failed to parse categories");
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white pb-20">
      {/* --- HERO SECTION --- */}
      <div className="bg-[#121827] border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
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
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-[#1E293B] shadow-xl shrink-0 bg-white"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 text-5xl font-bold ring-4 ring-gray-800 shadow-xl shrink-0">
                {club.name.charAt(0)}
              </div>
            )}

            {/* Title & Info */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                  {club.type} SOCIETY
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                  {club.name}
                </h1>

                {/* NEW: Display Society Head Name */}
                {societyHead && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-1">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium text-gray-300">
                      Headed by <span className="font-bold">{societyHead.name}</span>
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl pt-2">
                {club.description}
              </p>

              {/* Categories/Tags */}
              {parsedCategories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {parsedCategories.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#1E293B] text-gray-300 text-xs font-medium rounded-full border border-gray-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                {club.instagram && (
                  <SocialIcon type="instagram" url={club.instagram} />
                )}
                {club.linkedin && (
                  <SocialIcon type="linkedin" url={club.linkedin} />
                )}
                {club.youtube && (
                  <SocialIcon type="youtube" url={club.youtube} />
                )}
                {club.website && (
                  <SocialIcon type="website" url={club.website} />
                )}
                {club.linktree && (
                  <SocialIcon type="linktree" url={club.linktree} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* --- MEMBERS SECTION --- */}
        {clubMembers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Our Core Team
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {clubMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#121827] border border-gray-800 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:border-[#3b82f6]/50 transition-colors"
                >
                  {member.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover mb-3 ring-2 ring-gray-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-xl mb-3 ring-2 ring-gray-700">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-white font-bold text-sm line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mt-1 line-clamp-1">
                    {member.designation}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- EVENTS SECTION --- */}
        <section className="space-y-0">
          {upcomingEvents.length > 0 ? (
            <UpcomingEvents events={upcomingEvents} />
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Upcoming Events
              </h2>
              <div className="bg-[#121827] border border-gray-800 rounded-xl p-8 text-center text-gray-500">
                No upcoming events planned at the moment. Check back soon!
              </div>
            </div>
          )}

          {previousEvents.length > 0 && (
            <div className="mt-16">
              <PastEvents events={previousEvents} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENTS FOR THIS PAGE
// ==========================================

function SocialIcon({ type, url }: { type: string; url: string }) {
  // Make sure URLs are absolute
  const href = url.startsWith("http") ? url : `https://${url}`;

  // Basic SVG Icons based on type
  const getIcon = () => {
    switch (type) {
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z" />
          </svg>
        );
      case "website":
        return (
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
      case "linktree":
        return (
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            id="Linktree--Streamline-Simple-Icons"
            height="24"
            width="24"
          >
            <desc>Linktree Streamline Icon: https://streamlinehq.com</desc>
            <title>Linktree</title>
            <path
              d="m13.73635 5.85251 4.00467 -4.11665 2.3248 2.3808 -4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766 -2.3248 2.3338L12.0005 12.099l-5.74052 5.76852 -2.3248 -2.3248 4.22864 -4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248 -2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"
              fill="currentColor"
              strokeWidth="1"
            ></path>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
      title={type}
    >
      {getIcon()}
    </a>
  );
}
