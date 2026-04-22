import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login", // Explicitly define your login page
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        // Return user object - ensure ID is a string
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          clubId: user.clubId || undefined, // ADDED: Pull clubId from DB
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // ADDED: Attach clubId to the encrypted token
        token.clubId = user.clubId; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "SOCIETY_HEAD"
          | "SOCIETY_MEMBER"
          | "MODERATOR";
        // ADDED: Expose clubId to your frontend/server components
        session.user.clubId = token.clubId as string | undefined;
      }
      return session;
    },
  },
});