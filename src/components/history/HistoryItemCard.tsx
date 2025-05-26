// src/components/history/HistoryItemCard.tsx
"use client";

import Image from 'next/image';
import type { HistoryEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, ImageOff } from 'lucide-react'; // Added ImageOff

interface HistoryItemCardProps {
  entry: HistoryEntry;
}

export function HistoryItemCard({ entry }: HistoryItemCardProps) {
  const entryDate = new Date(entry.date);
  
  // Use a placeholder if the image is marked as "placeholder" (not stored) or is actually missing
  const imageSrc = entry.uploadedImage && entry.uploadedImage !== "placeholder" ? entry.uploadedImage : "https://placehold.co/300x200.png?text=No+Image";
  const showActualImage = entry.uploadedImage && entry.uploadedImage !== "placeholder";

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
      <CardHeader className="pb-3">
        <div className="relative w-full h-40 sm:h-48 mb-2 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
            {showActualImage ? (
                <Image 
                    src={imageSrc} 
                    alt="Uploaded food" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    objectFit="cover"
                    data-ai-hint="food meal"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x200.png?text=Error"; }}
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff className="w-12 h-12 mb-2" />
                    <span className="text-xs">Image not stored</span>
                </div>
            )}
        </div>
        <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
          Estimation - {entry.foodItems.length > 0 ? entry.foodItems[0].name.substring(0,20) + (entry.foodItems[0].name.length > 20 ? "..." : "") : "Details"}
        </CardTitle>
        <CardDescription className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <CalendarDays className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {entryDate.toLocaleDateString()} - {entryDate.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-foreground mb-1">Identified Items:</h4>
          {entry.foodItems.length > 0 ? (
            <ul className="list-disc list-inside pl-1 space-y-0.5 max-h-20 sm:max-h-24 overflow-y-auto">
              {entry.foodItems.map((item, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  {item.name}: <span className="font-medium text-foreground">{item.estimatedCalories} kcal</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No items were identified for this entry.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-2 sm:p-3 mt-auto">
        <div className="flex items-center justify-between w-full">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <Badge variant="default" className="text-xs sm:text-sm bg-primary text-primary-foreground">
            Total: {entry.totalCalories} kcal
            </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
