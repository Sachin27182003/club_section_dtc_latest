import { redirect } from "next/navigation";
import { auth } from "@/lib/db/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session using the full Node.js runtime
  const session = await auth();

  // If there is no user, boot them to the sign-in page immediately
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // If they are logged in, render the dashboard pages
  return <>{children}</>;
}