// src/app/history/page.tsx
import { HistoryView } from '@/components/history/HistoryView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estimation History - CalorieCam',
  description: 'View your past food calorie estimations.',
};

export default function HistoryPage() {
  return (
    <HistoryView />
  );
}
