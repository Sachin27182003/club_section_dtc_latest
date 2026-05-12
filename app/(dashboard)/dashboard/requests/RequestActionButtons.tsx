// requests/RequestActionButtons.tsx

"use client";

import { useState } from "react";
import { updateRequestStatus } from "@/actions/manageRequests"; // Path to the server action we created

export default function RequestActionButtons({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    setIsLoading(true);
    try {
      await updateRequestStatus(userId, action);
      // Optional: Add a toast notification here if you have a library like react-hot-toast
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
      <button
        onClick={() => handleAction("REJECT")}
        disabled={isLoading}
        className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
      >
        Decline
      </button>
      <button
        onClick={() => handleAction("APPROVE")}
        disabled={isLoading}
        className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Processing..." : "Approve"}
      </button>
    </div>
  );
}