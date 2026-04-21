"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createUser } from "@/actions/createUser"; // Adjust path if needed
import { Shield, User, Mail, Lock, Building, Key } from "lucide-react";
import { ActionResponse } from "@/type/actions";
import { SignupFormData } from "@/type/user";

export default function SignupPage() {
  const router = useRouter();

  // Toggle between Club Admin and Moderator
  const [isModerator, setIsModerator] = useState<boolean>(false);

  // Setup React Query Mutation with explicit Type Generics:
  // useMutation<TData, TError, TVariables>
  const { mutate: handleSignup, isPending } = useMutation<
    ActionResponse,
    Error,
    SignupFormData
  >({
    mutationFn: async (data: SignupFormData): Promise<ActionResponse> => {
      const result = await createUser(data);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success(
        isModerator
          ? "Account active! Redirecting..."
          : "Request sent! Waiting for Moderator approval...",
      );
      // Redirect them to login after 2 seconds
      setTimeout(() => router.push("/"), 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Construct strictly typed data object
    const data: SignupFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      // Use logical OR to fall back to undefined if the field is empty/null
      clubId: (formData.get("clubId") as string | null) || undefined,
      secretKey: (formData.get("secretKey") as string | null) || undefined,
    };

    handleSignup(data);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-[#232c72] dark:text-indigo-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-800">
          {/* Role Toggle */}
          <div className="flex justify-center mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setIsModerator(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isModerator
                  ? "bg-white dark:bg-gray-700 shadow text-[#232c72] dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Society Admin
            </button>
            <button
              type="button"
              onClick={() => setIsModerator(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isModerator
                  ? "bg-[#232c72] dark:bg-indigo-600 shadow text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              College Moderator
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                College Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="john@dtc.edu"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Dynamic Field: Club ID (For Society Admins) */}
            {!isModerator && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Club / Society Name
                </label>

                {/* This container must ONLY wrap the icon and input */}
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    name="clubId"
                    type="text"
                    required
                    className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="E.g., Music Society"
                  />
                </div>

                {/* Move the helper text HERE, outside the relative div */}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your account will require Moderator&apos;s approval before
                  activation.
                </p>
              </div>
            )}

            {/* Dynamic Field: Secret Key (For Moderators) */}
            {isModerator && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moderator Secret Key
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                  </div>
                  <input
                    name="secretKey"
                    type="password"
                    required
                    className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-rose-500 dark:focus:ring-rose-500 focus:border-rose-500 dark:focus:border-rose-500 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter Dean/HOD authorization key"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isPending
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-[#232c72] dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-700"
                }`}
              >
                {isPending ? "Processing..." : "Sign Up"}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-[#232c72] dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
