"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createUser } from "@/actions/createUser";
import { signIn } from "next-auth/react"; // ADD THIS IMPORT
import {
  Shield,
  User,
  Mail,
  Lock,
  Building,
  Key,
  Briefcase,
} from "lucide-react";
import { ActionResponse } from "@/type/actions";
import { SignupFormData } from "@/type/user";

export default function SignupPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<
    "SOCIETY_HEAD" | "SOCIETY_MEMBER" | "MODERATOR"
  >("SOCIETY_MEMBER");

  const { mutate: handleSignup, isPending } = useMutation<
    ActionResponse,
    Error,
    SignupFormData
  >({
    mutationFn: async (data: SignupFormData) => {
      const result = await createUser(data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    // USE `variables` to access the email/password they just typed
    onSuccess: async (data, variables) => {
      toast.success("Account created! Logging you in...");

      // Auto-login the user immediately
      const signInResult = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false, // Prevents a hard page reload
      });

      if (signInResult?.error) {
        toast.error("Auto-login failed. Please sign in manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh(); // Refreshes server components to recognize the new session cookie
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data: SignupFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: selectedRole,
      clubId: (formData.get("clubId") as string | null) || undefined,
      designation: (formData.get("designation") as string | null) || undefined,
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
          {/* 3-WAY ROLE TOGGLE */}
          <div className="flex justify-between mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedRole("SOCIETY_MEMBER")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                selectedRole === "SOCIETY_MEMBER"
                  ? "bg-white dark:bg-gray-700 shadow text-[#232c72] dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("SOCIETY_HEAD")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                selectedRole === "SOCIETY_HEAD"
                  ? "bg-white dark:bg-gray-700 shadow text-[#232c72] dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Society Head
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("MODERATOR")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                selectedRole === "MODERATOR"
                  ? "bg-[#232c72] dark:bg-indigo-600 shadow text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Moderator
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Standard Fields (Name, Email, Password) remain unchanged */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] focus:border-[#232c72]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                College Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] focus:border-[#232c72]"
                  placeholder="john@dtc.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] focus:border-[#232c72]"
                  placeholder="••••••••"
                />
              </div>
              {selectedRole === "SOCIETY_HEAD" && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Your account requires Moderator's approval.
                </p>
              )}
            </div>

            {/* EXCLUSIVE TO MEMBER: Club ID */}
            {selectedRole === "SOCIETY_MEMBER" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Club / Society Name (To Join)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="clubId"
                      type="text"
                      required
                      className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] focus:border-[#232c72]"
                      placeholder="E.g., Music Society"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EXCLUSIVE TO HEAD: Designation (Fixed Bug Here) */}
            {selectedRole === "SOCIETY_MEMBER" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Designation
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="designation"
                    type="text"
                    required
                    className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-[#232c72] focus:border-[#232c72]"
                    placeholder="e.g., President, Technical Head"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Your account requires Society Head's approval.
                </p>
              </div>
            )}

            {/* EXCLUSIVE TO MODERATOR: Secret Key */}
            {selectedRole === "MODERATOR" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moderator Secret Key
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-rose-500" />
                  </div>
                  <input
                    name="secretKey"
                    type="password"
                    required
                    className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2 border focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter Moderator's authorization key"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#232c72] hover:bg-indigo-800"
                }`}
              >
                {isPending ? "Processing..." : "Sign Up"}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-[#232c72] hover:text-indigo-800"
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
