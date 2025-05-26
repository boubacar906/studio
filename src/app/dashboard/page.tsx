
// src/app/dashboard/page.tsx (Moved from /src/app/page.tsx)
import type { Metadata } from 'next';
import { DashboardClientContent } from '@/components/dashboard/DashboardClientContent';

export const metadata: Metadata = {
  title: 'Dashboard - CalorieCam',
  description: 'Overview of your calorie intake and meal history.',
};

export default function DashboardHomePage() { // Renamed function to avoid conflict if needed
  return <DashboardClientContent />;
}
