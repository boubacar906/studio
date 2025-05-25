
// src/app/history/page.tsx
"use client"; // Required for hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { HistoryView } from '@/components/history/HistoryView';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

// export const metadata: Metadata = {
// title: 'Estimation History - CalorieCam',
// description: 'View your past food calorie estimations.',
// };
// Metadata removed for client component, handle as needed.

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading history...</p>
      </div>
    );
  }
  
  return (
    <HistoryView />
  );
}
