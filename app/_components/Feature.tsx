// StudentChapter.tsx

import React from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import Link from "next/link";
import { getAllClubs } from "@/actions/getAllClubs";

async function StudentChapter() {
  // 1. Fetch ALL societies
  const allClubs = await getAllClubs();

  // 2. Filter for just the Student Chapters
  const studentChapterData = allClubs.filter(
    (club) => club?.type === "STUDENT_CHAPTER",
  );

  // Handle empty state
  if (!studentChapterData || studentChapterData.length === 0) {
    return (
      <div className="bg-rose-100 dark:bg-slate-900 border-2 border-indigo-900 dark:border-indigo-400 rounded-3xl p-6 md:p-8 mb-6 text-center text-gray-500">
        No student chapters found.
      </div>
    );
  }

  return (
    <>
      <div className="bg-rose-100 dark:bg-slate-900 border-2 border-indigo-900 dark:border-indigo-400 rounded-3xl p-6 md:p-8 mb-6 transition-colors duration-300">
        <Reveal delay={100}>
          <h2 className="text-2xl text-neutral-700 dark:text-neutral-200 font-semibold mb-8 transition-colors duration-300">
            Student Chapters ({studentChapterData.length})
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-colors duration-300">
          {studentChapterData.map((club, i) => {
            // Generate slug from the DB slug
            const clubSlug =
              club.slug || club.name.toLowerCase().replace(/\s+/g, "-");

            // Safely parse categories (Handle both stringified JSON and direct arrays)
            let displayCategories: string[] = [];
            if (club.categories) {
              try {
                const parsed =
                  typeof club.categories === "string"
                    ? JSON.parse(club.categories)
                    : club.categories;

                if (Array.isArray(parsed)) {
                  // Limit to max 2 categories to keep the UI clean
                  displayCategories = parsed.slice(0, 2);
                }
              } catch (e) {
                console.error("Failed to parse categories for", club.name);
              }
            }

            return (
              <Reveal key={club.id || i} delay={100 * (i % 4)} className="h-full">
                <Link
                  href={`/society/${clubSlug}`}
                  className="bg-white dark:bg-slate-800 border-2 border-indigo-900 dark:border-indigo-400 text-gray-900 dark:text-gray-100 p-6 rounded-xl flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full h-full"
                >
                  <Image
                    src={
                      club.logoUrl
                        ? club.logoUrl.startsWith("http")
                          ? club.logoUrl
                          : `/${club.logoUrl}`
                        : "/default-club-logo.png"
                    }
                    alt={club.name}
                    width={72}
                    height={72}
                    className="w-18 h-18 rounded-full object-cover shadow-md mb-3"
                  />

                  <h3 className="font-bold text-lg text-center">{club.name}</h3>

                  {/* Render categories as badges at the bottom */}
                  {displayCategories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-auto pt-3">
                      {displayCategories.map((category, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default StudentChapter;