// src/components/history/HistoryView.tsx
"use client";

import { useHistory } from '@/hooks/useHistory';
import { HistoryItemCard } from './HistoryItemCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, History as HistoryIcon, Trash2, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function HistoryView() {
  const { history, clearHistory, isHistoryLoading } = useHistory();

  if (isHistoryLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <HistoryIcon className="mr-3 h-8 w-8 text-accent" />
          Estimation History
        </h1>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your estimation history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Yes, delete history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 px-4 bg-card rounded-lg shadow">
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-foreground">No history yet.</p>
          <p className="text-muted-foreground">Start estimating calories from your food images, and your history will appear here.</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)] pr-3"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {history.map((entry) => (
              <HistoryItemCard key={entry.id} entry={entry} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
