import Link from 'next/link';
import { Reveal } from '@/app/_components/Reveal';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-rose-50 dark:bg-rose-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <Reveal>
        {/* Giant 404 Header */}
        <h1 className="text-9xl font-extrabold text-indigo-900 dark:text-indigo-400 mb-4 tracking-tighter">
          404
        </h1>
        
        {/* Friendly Error Message */}
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto">
          Oops! It looks like the club, event, or page you are looking for doesn't exist or might have been moved.
        </p>
        
        {/* Call to Action */}
        <Link
          href="/"
          className="inline-block bg-[#232c72] hover:bg-indigo-800 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
        >
          Return Home
        </Link>
      </Reveal>
    </main>
  );
}