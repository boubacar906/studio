// src/app/nutrient-analysis/page.tsx
import type { Metadata } from 'next';
import { NutrientAnalysisClientContent } from '@/components/nutrient-analysis/NutrientAnalysisClientContent';

export const metadata: Metadata = {
  title: 'Nutrient Analysis - CalorieCam',
  description: 'Analyze your recent meals for nutrient insights and suggestions.',
};

export default function NutrientAnalysisPage() {
  return <NutrientAnalysisClientContent />;
}
