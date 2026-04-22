// components/Providers.tsx
"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react"; // ADD THIS

export default function Providers({ children }: { children: React.ReactNode }) {
  // Ensure React Query client is stable across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Wrap EVERYTHING inside the SessionProvider
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}