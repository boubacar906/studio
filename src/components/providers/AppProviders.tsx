
// src/components/providers/AppProviders.tsx
"use client";

import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/useAuth'; // Added AuthProvider

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider> {/* Wrapped children with AuthProvider */}
      {children}
      <Toaster />
    </AuthProvider>
  );
}
