"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

// 1. Import signIn directly from NextAuth React
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // 2. Extract credentials here
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // 3. Call the client-side signIn directly
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // This works perfectly on the client-side
      });

      // 4. Handle Auth.js built-in error responses
      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push("/dashboard");

      // Force a hard refresh of the router so the Next.js layout
      // realizes the user is now authenticated
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleLogin(formData);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 pb-24 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-10 w-10 text-[#232c72] dark:text-indigo-400" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to Hub
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100 dark:border-gray-800">
          <form className="space-y-5" onSubmit={onSubmit}>
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="text-xs">
                  <Link
                    href="#"
                    className="font-medium text-[#232c72] dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full sm:text-sm bg-transparent border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md py-2.5 border focus:ring-[#232c72] dark:focus:ring-indigo-500 focus:border-[#232c72] dark:focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
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
                {isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
