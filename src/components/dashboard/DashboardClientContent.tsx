
// src/components/dashboard/DashboardClientContent.tsx
"use client";

import { useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import { useAuth } from '@/hooks/useAuth'; // Added useAuth
import { useHistory } from '@/hooks/useHistory';
import { HistoryItemCard } from '@/components/history/HistoryItemCard';
import { StatCard } from './StatCard';
import { NutrientAnalysisCard } from './NutrientAnalysisCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CalendarDays, ListChecks, BarChart3, UploadCloud, Camera, Loader2 } from 'lucide-react'; // Added Loader2
import Link from 'next/link';
import Image from 'next/image';

export function DashboardClientContent() {
  const { user, isLoading: authLoading } = useAuth(); // Get auth state
  const router = useRouter();
  const { history, isHistoryLoading } = useHistory();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login'); // Redirect to login if not authenticated and auth check is complete
    }
  }, [user, authLoading, router]);

  // Placeholder data - replace with actual calculations
  const caloriesToday = history.length > 0 ? history[0].totalCalories : 0; 
  const caloriesThisWeek = history.reduce((acc, curr) => acc + curr.totalCalories, 0) / 2; 
  const caloriesThisMonth = history.reduce((acc, curr) => acc + curr.totalCalories, 0); 

  const recentMeals = history.slice(0, 6);

  if (authLoading || (!user && !authLoading)) { // Show loading spinner while auth state is resolving or if redirecting
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  // User is authenticated, render dashboard
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">Activity Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Calories Today"
            value={`${caloriesToday.toFixed(0)} kcal`}
            icon={Activity}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            title="Avg. Calories This Week"
            value={`${caloriesThisWeek.toFixed(0)} kcal`}
            icon={CalendarDays}
             color="bg-secondary/10 text-secondary"
          />
          <StatCard
            title="Total Meals Logged"
            value={`${history.length} meals`}
            icon={ListChecks}
            color="bg-accent/10 text-accent"
          />
        </div>
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-primary h-6 w-6" />
              Quick Estimate
            </CardTitle>
            <CardDescription>Ready for your next meal? Upload an image to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/estimate" passHref>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="mr-2 h-4 w-4" />
                Estimate New Meal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent Meals</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/history">View All</Link>
              </Button>
            </div>
            {isHistoryLoading ? (
              <p className="text-muted-foreground">Loading recent meals...</p>
            ) : recentMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {recentMeals.map((entry) => (
                  <HistoryItemCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <Card className="bg-card border-dashed">
                <CardContent className="p-6 text-center">
                  <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <CardTitle className="text-xl mb-1">No Meals Yet</CardTitle>
                  <CardDescription className="mb-4">Start estimating calories to see your meals here.</CardDescription>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/estimate">Estimate First Meal</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-6 md:space-y-8">
          <NutrientAnalysisCard recentMeals={recentMeals.map(m => ({name: m.foodItems.map(fi => fi.name).join(', '), estimatedCalories: m.totalCalories}))} />

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-accent h-6 w-6" />
                    Weekly Progress
                </CardTitle>
                 <CardDescription>A visual look at your intake (placeholder).</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src="https://placehold.co/600x400.png?text=Sample+Chart" alt="Sample Chart" width={600} height={400} className="rounded-md" data-ai-hint="chart graph"/>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
