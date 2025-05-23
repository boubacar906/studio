// src/components/providers/AppProviders.tsx
"use client";

import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
