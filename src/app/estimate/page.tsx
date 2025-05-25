
// src/app/estimate/page.tsx
"use client"; // Required for hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { CalorieEstimator } from '@/components/calorie-estimator/CalorieEstimator';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

// export const metadata: Metadata = { // Metadata needs to be static or generated in generateMetadata
// title: 'Estimate Calories - CalorieCam',
// description: 'Upload a picture of your food and get an estimate of its calorie content.',
// };
// For client components, metadata should be handled differently or set in a parent layout/page server component if static.
// For now, we'll remove this static metadata from the client component.

export default function EstimatePage() {
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
        <p className="mt-4 text-muted-foreground">Loading estimator...</p>
      </div>
    );
  }

  return (
     <div className="w-full max-w-5xl mx-auto">
        <CalorieEstimator />
    </div>
  );
}

// If you need dynamic metadata based on auth or other client state, it's more complex.
// For a simple title, you can set it via document.title in a useEffect, but Next.js's metadata API is preferred for SEO.
// Example of setting title dynamically (though not ideal for SEO if page is mostly client-rendered):
// useEffect(() => {
// document.title = 'Estimate Calories - CalorieCam';
// }, []);
