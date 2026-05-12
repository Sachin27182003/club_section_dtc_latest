// requests/ResetActionButtons.tsx

"use client";

import { useState } from "react";
import { resolvePasswordReset } from "@/actions/passwordActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ResetActionButtons({ 
  requestId, 
  userId 
}: { 
  requestId: string; 
  userId: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResolve = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resolvePasswordReset(requestId, userId, newPassword);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password updated! Please share it with the user.");
        setNewPassword("");
        router.refresh(); // Refresh the page to remove the request from the list
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-auto mt-4 sm:mt-0 gap-2">
      {/* NEW: Instruction text for the Moderator/Head */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Create a simple temporary password and share it with the user directly.
      </p>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <input
          type="text"
          // CHANGED: Placeholder gives a clear example
          placeholder="e.g., welcome123"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-48"
        />
        <button
          onClick={handleResolve}
          disabled={isLoading || !newPassword}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-sm disabled:opacity-50 transition-colors whitespace-nowrap text-sm"
        >
          {isLoading ? "Saving..." : "Set Password"}
        </button>
      </div>
    </div>
  );
}