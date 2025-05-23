// src/components/calorie-estimator/ResultsDisplay.tsx
"use client";

import type { FoodItem } from "@/lib/types";
import { FoodItemCard } from "./FoodItemCard";
import { AlertCircle, ListChecks } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResultsDisplayProps {
  foodItems: FoodItem[];
  onViewDetails: (item: FoodItem) => void;
  totalCalories: number;
}

export function ResultsDisplay({ foodItems, onViewDetails, totalCalories }: ResultsDisplayProps) {
  if (foodItems.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        <ListChecks className="mx-auto h-12 w-12 mb-2" />
        <p>No food items identified yet. Upload an image to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 bg-secondary/30 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center sm:text-left">Identified Food Items</h2>
        <div className="text-md sm:text-lg font-medium text-foreground text-center sm:text-right">
          Total Estimated Calories: <span className="font-bold text-primary">{totalCalories} kcal</span>
        </div>
      </div>
      {foodItems.some(item => item.errorAccompaniments) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accompaniment Error</AlertTitle>
          <AlertDescription>
            There was an issue fetching accompaniments for one or more items. Details are shown on the respective cards.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {foodItems.map((item) => (
          <FoodItemCard key={item.id} item={item} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}
