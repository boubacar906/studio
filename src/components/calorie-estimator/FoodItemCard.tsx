// src/components/calorie-estimator/FoodItemCard.tsx
"use client";

import type { FoodItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Info, Loader2 } from "lucide-react";

interface FoodItemCardProps {
  item: FoodItem;
  onViewDetails: (item: FoodItem) => void;
}

export function FoodItemCard({ item, onViewDetails }: FoodItemCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-foreground">{item.name}</CardTitle>
          {item.isLoadingAccompaniments && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>
        <CardDescription className="text-sm">
          Estimated Calories: <Badge variant="outline" className="font-semibold text-primary border-primary">{item.estimatedCalories} kcal</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => onViewDetails(item)} 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={item.isLoadingAccompaniments}
        >
          <Info className="mr-2 h-4 w-4" />
          View Details & Accompaniments
        </Button>
         {item.errorAccompaniments && (
          <p className="text-xs text-destructive mt-2">{item.errorAccompaniments}</p>
        )}
      </CardContent>
    </Card>
  );
}
