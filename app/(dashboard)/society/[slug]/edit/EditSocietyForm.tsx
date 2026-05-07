"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateSociety } from "@/actions/updateSociety";
import {
  Building,
  Tags,
  Link as LinkIcon,
  Globe,
  ImagePlus,
  X,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { Instagram, Linkedin, Youtube } from "@/helpers/footer_svg";

type UpdateSocietyResponse = {
  success?: boolean;
  error?: string;
};

export default function EditSocietyForm({ club }: { club: any }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with the existing logo if it exists
  const [imagePreview, setImagePreview] = useState<string | null>(
    club.logoUrl || null,
  );
  const [fileName, setFileName] = useState<string | null>(null);

  // Convert JSON array back to comma separated string for the input
  const initialCategories = Array.isArray(club.categories)
    ? club.categories.join(", ")
    : typeof club.categories === "string"
      ? JSON.parse(club.categories).join(", ")
      : "";

  const { mutate: handleUpdateSociety, isPending } = useMutation<
    UpdateSocietyResponse,
    Error,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      const result = await updateSociety(club.id, formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Society updated successfully!");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleUpdateSociety(formData);
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

  function handleDiscard() {
    if (formRef.current) {
      formRef.current.reset(); // Resets all text inputs to their defaultValues
    }
    setImagePreview(club.logoUrl || null); // Revert image preview
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast("Form changes discarded", { icon: "🧹" });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-8 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300"
    >
      {/* SECTION 1: Core Details */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Core Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Society Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              defaultValue={club.name}
              required
              className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Society Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              defaultValue={club.type}
              required
              className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
            >
              <option value="TECHNICAL">Technical</option>
              <option value="CULTURAL">Cultural</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            defaultValue={club.description}
            required
            rows={4}
            className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border resize-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            Categories / Tags
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tags className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              name="categories"
              type="text"
              defaultValue={initialCategories}
              className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
              placeholder="e.g., Web Development, Open Source, DSA"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separate multiple tags with a comma.
          </p>
        </div>
      </div>

      {/* SECTION: Society Logo Update */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          Society Logo (Leave blank to keep current)
        </label>

        <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50 relative">
          {imagePreview ? (
            <div className="flex flex-col items-center z-10">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-50">
                {fileName || "Current Logo"}
              </p>
            </div>
          ) : (
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <ImagePlus className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Click to upload a new file
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, WEBP up to 5MB
              </p>
            </label>
          )}

          <input
            id="logo-upload"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </div>

      {/* SECTION 2: Social Links */}
      <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-gray-900 dark:text-white mt-4">
          <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Social Links (Optional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instagram
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-4 h-4 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                  <Instagram />
                </div>
              </div>
              <input
                name="instagram"
                type="url"
                defaultValue={club.instagram || ""}
                className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LinkedIn
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-4 h-4 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                  <Linkedin />
                </div>
              </div>
              <input
                name="linkedin"
                type="url"
                defaultValue={club.linkedin || ""}
                className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              YouTube
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                name="youtube"
                type="url"
                defaultValue={club.youtube || ""}
                className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
                placeholder="https://youtube.com/@..."
              />
            </div>
          </div>

          {/* Linktree */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Linktree
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                name="linktree"
                type="url"
                defaultValue={club.linktree || ""}
                className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
                placeholder="https://linktr.ee/..."
              />
            </div>
          </div>

          {/* Official Website */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Official Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                name="website"
                type="url"
                defaultValue={club.website || ""}
                className="w-full pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 border transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (Save, Discard, Go Back) */}
      <div className="pt-6 mt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <button
          type="button"
          onClick={handleDiscard}
          className="flex items-center justify-center gap-2 py-3 px-6 border border-red-200 dark:border-red-900/50 rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Discard
        </button>

        <button
          type="submit"
          disabled={isPending}
          className={`flex items-center justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
            isPending
              ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
