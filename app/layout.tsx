import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/app/_components/Navbar";
import { auth } from "@/lib/auth";
import Footer from "./_components/Footer";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Club Section Dtc",
  description:
    "Dedicated section for handling and showcasing clubs and societies of DTC",
  icons: {
    icon: "/logo-dtc.png",
    apple: "/logo-dtc.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log("@SESSION", session)

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE URL IS MISSING");
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar session={session} />
          <Toaster position="top-center" reverseOrder={false} />
          <main>{children}</main>
          <Footer />
          <div className="w-full text-sm py-4 px-4 md:px-10 flex items-center justify-center md:justify-center text-center">
            <p>
              © All rights reserved Delhi Technical Campus | Built by{" "}
              <Link
                href="https://github.com/Sachin27182003"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Sachin
              </Link>{" "}
              {/* |{" "}
              <Link
                href="https://github.com/rohankamat24"
                target="_blank"
                className="hover:text-white transition-colors"
              >
              Rohan
              </Link>{" "}
                |{" "}
              <Link
                href="https://github.com/Rajat-2005"
                target="_blank"
                className="hover:text-white transition-colors"
              >
              Rajat
              </Link>{" "} */}
              |
            </p>
          </div>
        </Providers>
      </body>
    </html>
  );
}
