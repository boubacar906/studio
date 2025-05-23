// src/components/layout/Header.tsx
import Link from 'next/link';
import { Utensils } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
          <Utensils className="h-7 w-7 text-accent" />
          <span className="text-foreground">CalorieCam</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Estimate
          </Link>
          <Link href="/history" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
