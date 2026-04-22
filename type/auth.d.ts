import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SOCIETY_HEAD" | "SOCIETY_MEMBER" | "MODERATOR";
      clubId?: string | undefined; // Let TS know this exists
    } & DefaultSession["user"];
  }

  interface User {
    role: "SOCIETY_HEAD" | "SOCIETY_MEMBER" | "MODERATOR";
    clubId?: string | undefined; // Let TS know this exists
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: "SOCIETY_HEAD" | "SOCIETY_MEMBER" | "MODERATOR";
  }
}
