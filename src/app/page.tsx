// src/app/page.tsx (New Dashboard Home Page)
import type { Metadata } from 'next';
import { DashboardClientContent } from '@/components/dashboard/DashboardClientContent';

export const metadata: Metadata = {
  title: 'Dashboard - CalorieCam',
  description: 'Overview of your calorie intake and meal history.',
};

export default function DashboardPage() {
  return <DashboardClientContent />;
}
