import Link from "next/link";

export function UserProfileBanner({ user }: { user: any }) {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name || "User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg border border-blue-100 dark:border-blue-900/50">
        {user.role?.replace("_", " ")}
      </div>
    </div>
  );
}

export function EventCard({
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
