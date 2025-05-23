// src/components/calorie-estimator/AccompanimentsDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FoodItem } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface AccompanimentsDialogProps {
  foodItem: FoodItem | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AccompanimentsDialog({ foodItem, isOpen, onOpenChange }: AccompanimentsDialogProps) {
  if (!foodItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground">
            {foodItem.name} - Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Estimated Calories: <Badge variant="secondary" className="text-sm">{foodItem.estimatedCalories} kcal</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-base sm:text-lg font-medium mb-2 text-foreground">Suggested Accompaniments:</h3>
          {foodItem.isLoadingAccompaniments ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <p className="ml-2 text-sm text-muted-foreground">Loading accompaniments...</p>
            </div>
          ) : foodItem.errorAccompaniments ? (
             <p className="text-destructive text-sm">{foodItem.errorAccompaniments}</p>
          ) : (foodItem.accompaniments && foodItem.accompaniments.length > 0) ? (
            <ScrollArea className="h-32 sm:h-40 rounded-md border border-border p-3">
              <ul className="space-y-1">
                {foodItem.accompaniments.map((acc, index) => (
                  <li key={index} className="text-xs sm:text-sm text-foreground p-1 bg-background rounded-md">
                    {acc}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No specific accompaniments suggested or available.</p>
          )}
        </div>

        {foodItem.info && (
            <div className="py-4 border-t border-border">
                <h3 className="text-base sm:text-lg font-medium mb-2 text-foreground">Additional Information:</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{foodItem.info}</p>
            </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
