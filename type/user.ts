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
