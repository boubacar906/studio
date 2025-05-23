// src/components/history/HistoryItemCard.tsx
"use client";

import Image from 'next/image';
import type { HistoryEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText } from 'lucide-react';

interface HistoryItemCardProps {
  entry: HistoryEntry;
}

export function HistoryItemCard({ entry }: HistoryItemCardProps) {
  const entryDate = new Date(entry.date);
  
  // Fallback image if entry.uploadedImage is invalid
  const imageSrc = entry.uploadedImage || "https://placehold.co/300x200.png";


  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
      <CardHeader className="pb-3">
        <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden">
            <Image 
                src={imageSrc} 
                alt="Uploaded food" 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="food meal"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x200.png"; }}
            />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">
          Estimation Result
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-1.5 h-4 w-4" /> {entryDate.toLocaleDateString()} - {entryDate.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-1">Identified Items:</h4>
          {entry.foodItems.length > 0 ? (
            <ul className="list-disc list-inside pl-1 space-y-0.5 max-h-24 overflow-y-auto">
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
      <CardFooter className="bg-secondary/50 p-3 mt-auto">
        <div className="flex items-center justify-between w-full">
            <FileText className="h-4 w-4 text-primary" />
            <Badge variant="default" className="text-sm bg-primary text-primary-foreground">
            Total: {entry.totalCalories} kcal
            </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
