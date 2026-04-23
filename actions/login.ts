// "use server";

// import { AuthError } from "next-auth";
// import { signIn } from "next-auth/react";

// export async function loginUser(formData: FormData) {
//   try {
//     const email = formData.get("email");
//     const password = formData.get("password");

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false, // REQUIRED for useMutation to handle the response
//     });

//     if (result?.error) {
//       return { error: "Invalid email or password" };
//     }

//     return { success: true };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { error: "Authentication failed. Please try again." };
//     }
//     // Don't rethrow here so useMutation gets the return object
//     return { error: "An unexpected error occurred." };
//   }
// }
