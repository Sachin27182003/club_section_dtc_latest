// app/forgot-password/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "@/actions/passwordActions";

export default function ForgotPasswordPage() {
  const { mutate: handleResetRequest, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const email = formData.get("email") as string;
      const result = await requestPasswordReset(email);

      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success(
        "Request sent! Please contact your Society Head or Moderator for your new password.",
        {
          duration: 6000, // Make this toast last a bit longer so they can read it
        },
      );
      // Optionally, you can clear the form here
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleResetRequest(formData);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 pb-24 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-10 w-10 text-[#232c72] dark:text-indigo-400" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 px-4">
          Enter your email. A request will be sent to your Society Head or
          Moderator to assign you a new temporary password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100 dark:border-gray-800">
          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                College Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2.5 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="john@dtc.edu"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white transition-all ${
                  isPending
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-[#232c72] dark:bg-indigo-600 hover:bg-[#1a215a] dark:hover:bg-indigo-700"
                }`}
              >
                {isPending ? "Sending Request..." : "Request Reset"}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#232c72] dark:hover:text-indigo-400 transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
