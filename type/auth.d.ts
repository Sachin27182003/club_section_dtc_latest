import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains the session data.
   */
  interface Session {
    user: {
      role?: "CLUB_ADMIN" | "MODERATOR";
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object as returned in the OAuth providers or Credentials `authorize` callback.
   */
  interface User {
    role?: "CLUB_ADMIN" | "MODERATOR";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: "CLUB_ADMIN" | "MODERATOR";
  }
}