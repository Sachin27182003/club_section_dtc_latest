// events/new/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/actions/createEvent";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  ImagePlus,
  X,
  FileText,
  Users,
} from "lucide-react";

type CreateEventResponse = {
  success?: boolean;
  error?: string;
};

export default function NewEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, status } = useSession();

  const [isOnline, setIsOnline] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      // CHANGED: Allow both SOCIETY_HEAD and SOCIETY_MEMBER
      if (role !== "SOCIETY_HEAD" && role !== "SOCIETY_MEMBER") {
        toast.error("Access Denied: Only Society Core Team can create events.");
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, session, router]);

  const { mutate: handleCreateEvent, isPending } = useMutation<
    CreateEventResponse,
    Error,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      // Manually append the checkbox state to the FormData
      formData.append("isOnline", isOnline.toString());
      const result = await createEvent(formData);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleCreateEvent(formData);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage(e: React.MouseEvent) {
    e.preventDefault();
    setImagePreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // CHANGED: Prevent rendering if not HEAD or MEMBER
  if (
    status === "authenticated" &&
    session?.user?.role !== "SOCIETY_HEAD" &&
    session?.user?.role !== "SOCIETY_MEMBER"
  ) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 py-8 sm:py-12 transition-colors duration-300">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <Link
          href="/dashboard"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Event
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Publish a new event, workshop, or competition for your society.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        {/* SECTION 1: Core Details */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Core Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Intro to Machine Learning Workshop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="Detail what attendees can expect..."
            />
          </div>
        </div>

        {/* SECTION 2: Schedule & Location */}
        <div className="space-y-6 pt-4">
          <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Schedule & Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                name="startDate"
                type="datetime-local"
                required
                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date & Time (Optional)
              </label>
              <input
                name="endDate"
                type="datetime-local"
                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="w-4 h-4 text-gray-500" /> Event Format
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
                />
                <label
                  htmlFor="isOnline"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  This is an online event
                </label>
              </div>
            </div>

            {isOnline ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meeting Link
                </label>
                <input
                  name="meetingLink"
                  type="url"
                  className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Venue / Room
                </label>
                <input
                  name="venue"
                  type="text"
                  className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Auditorium A"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Registration & Capacity */}
        <div className="space-y-6 pt-4">
          <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Registration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                External Registration Link (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  name="registrationLink"
                  type="url"
                  className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://forms.gle/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Capacity
              </label>
              <input
                name="maxCapacity"
                type="number"
                min="1"
                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Registration Deadline (Optional)
            </label>
            <input
              name="registrationDeadline"
              type="datetime-local"
              className="w-full md:w-1/2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-2.5 border outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* SECTION 4: Cover Image */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            Event Cover Image
          </label>

          <div className="mt-2 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50 relative">
            {imagePreview ? (
              <div className="flex flex-col items-center z-10 w-full">
                <div className="relative inline-block w-full max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Cover Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-50">
                  {fileName}
                </p>
              </div>
            ) : (
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer py-4"
              >
                <ImagePlus className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                  Click to upload a cover image
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 5MB (16:9 ratio recommended)
                </p>
              </label>
            )}

            <input
              id="cover-upload"
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-6 mt-8">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full flex justify-center py-3.5 px-4 rounded-lg shadow-md text-base font-bold text-white transition-all ${
              isPending
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
          >
            {isPending ? "Publishing Event..." : "Publish Event"}
          </button>
        </div>
      </form>
    </div>
  );
}