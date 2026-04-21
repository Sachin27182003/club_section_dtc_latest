// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"; // Ensure this points to your auth.ts file
export const { GET, POST } = handlers;