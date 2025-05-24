// src/app/estimate/page.tsx
import { CalorieEstimator } from '@/components/calorie-estimator/CalorieEstimator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimate Calories - CalorieCam',
  description: 'Upload a picture of your food and get an estimate of its calorie content.',
};

export default function EstimatePage() {
  return (
     <div className="w-full max-w-5xl mx-auto">
        <CalorieEstimator />
    </div>
  );
}
