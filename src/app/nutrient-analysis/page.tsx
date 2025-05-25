
// src/app/nutrient-analysis/page.tsx
"use client"; // Required for hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Metadata } from 'next';
import { NutrientAnalysisClientContent } from '@/components/nutrient-analysis/NutrientAnalysisClientContent';
import { Loader2 } from 'lucide-react';


// export const metadata: Metadata = {
// title: 'Nutrient Analysis - CalorieCam',
// description: 'Analyze your recent meals for nutrient insights and suggestions.',
// };
// Metadata removed for client component

export default function NutrientAnalysisPage() {
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
        <p className="mt-4 text-muted-foreground">Loading nutrient analysis...</p>
      </div>
    );
  }

  return <NutrientAnalysisClientContent />;
}
