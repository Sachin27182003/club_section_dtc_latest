import "next-auth/jwt";


// 1. Define the shape of your form data
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  clubId?: string;
  secretKey?: string;
}
