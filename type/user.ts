import "next-auth/jwt";

// 1. Define the shape of your form data
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: "SOCIETY_HEAD" | "SOCIETY_MEMBER" | "MODERATOR"; // Added
  clubId?: string;
  designation?: string;
  secretKey?: string;
}


// Assuming your enum looks something like this (adjust based on your actual mysqlEnum)
export type ClubType = "TECHNICAL" | "CULTURAL" | "SPORTS" | "LITERARY"; 

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  type: ClubType;
  categories: string[] | null; // Typed as string array based on your comment
  
  // Social Links
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  website: string | null;
  linktree: string | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new club (Omits auto-generated fields or makes them optional)
export interface CreateClubInput extends Omit<Club, "id" | "createdAt" | "updatedAt"> {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}