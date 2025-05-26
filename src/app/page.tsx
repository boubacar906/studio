
// src/app/page.tsx (New Landing Page)
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalorieEstimator } from '@/components/calorie-estimator/CalorieEstimator';
import { Utensils, LogIn, UserPlus, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CalorieCam - Snap, Estimate, Track Your Meals',
  description: 'Instantly estimate calories from food photos. Track your meals and nutrient intake with CalorieCam.',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-background to-muted/30">
      <header className="w-full py-4 px-6 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Utensils className="h-7 w-7" />
          <span>CalorieCam</span>
        </Link>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <Button variant="default" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center">
        <section className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Snap, Estimate, <span className="text-primary">Track.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Welcome to CalorieCam! Effortlessly estimate the calorie content of your meals by simply uploading a photo.
            Sign up to track your history and gain nutrient insights.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6" asChild>
                <Link href="#estimator">
                    <Sparkles className="mr-2 h-5 w-5"/> Try Quick Estimate
                </Link>
            </Button>
          </div>
        </section>

        <section id="estimator" className="w-full max-w-4xl mb-12 sm:mb-16 md:mb-20 scroll-mt-20">
          <CalorieEstimator />
        </section>

        <section className="text-center py-10 bg-card rounded-xl shadow-lg p-8 w-full max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">Ready to Take Control?</h2>
            <p className="text-md text-muted-foreground mb-6">
                Sign up for free to save your meal history, track your progress over time, and get personalized nutrient analysis to help you achieve your health goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6" asChild>
                    <Link href="/signup">
                        <UserPlus className="mr-2 h-5 w-5" /> Create Your Account
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild  className="text-lg px-8 py-6">
                    <Link href="/login">
                        <LogIn className="mr-2 h-5 w-5" /> Already have an account?
                    </Link>
                </Button>
            </div>
        </section>
      </main>

      <footer className="w-full py-6 text-center text-muted-foreground text-sm border-t border-border mt-auto">
        © {new Date().getFullYear()} CalorieCam. All rights reserved.
      </footer>
    </div>
  );
}
