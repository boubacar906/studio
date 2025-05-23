// src/components/calorie-estimator/CalorieEstimator.tsx
"use client";

import { useState, useTransition } from 'react';
import { ImageUpload } from './ImageUpload';
import { ResultsDisplay } from './ResultsDisplay';
import { AccompanimentsDialog } from './AccompanimentsDialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHistory } from '@/hooks/useHistory';
import { getCalorieEstimationAction, getFoodAccompanimentsAction } from '@/lib/actions';
import type { FoodItem, EstimatedFoodItemAi } from '@/lib/types';
import { convertFileToDataURI } from '@/lib/utils';

export function CalorieEstimator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFoodItemForDialog, setSelectedFoodItemForDialog] = useState<FoodItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEstimating, startEstimatingTransition] = useTransition();
  
  const { toast } = useToast();
  const { addHistoryEntry } = useHistory();

  const handleImageSelected = (file: File | null) => {
    setSelectedFile(file);
    setFoodItems([]); // Clear previous results
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const fetchAccompaniments = async (itemId: string, itemName: string) => {
    try {
      const result = await getFoodAccompanimentsAction(itemName);
      setFoodItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, accompaniments: result.accompaniments, isLoadingAccompaniments: false, errorAccompaniments: undefined } : item
        )
      );
    } catch (e) {
      console.error(`Failed to fetch accompaniments for ${itemName}:`, e);
      const errorMessage = e instanceof Error ? e.message : "Failed to load accompaniments.";
      setFoodItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, isLoadingAccompaniments: false, errorAccompaniments: errorMessage } : item
        )
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      toast({ title: "No Image", description: "Please select an image to estimate calories.", variant: "destructive" });
      return;
    }
    setError(null);
    setFoodItems([]);

    startEstimatingTransition(async () => {
      try {
        const dataUri = await convertFileToDataURI(selectedFile);
        const estimationResult = await getCalorieEstimationAction(dataUri);

        if (!estimationResult.foodItems || estimationResult.foodItems.length === 0) {
          setError("No food items were identified in the image.");
          toast({ title: "Estimation Complete", description: "No food items identified.", variant: "default" });
          setFoodItems([]);
          return;
        }
        
        const newFoodItems: FoodItem[] = estimationResult.foodItems.map((item: EstimatedFoodItemAi, index: number) => ({
          ...item,
          id: `${Date.now()}-${index}`, // Simple unique ID
          isLoadingAccompaniments: true, // Initially true, will be set to false after fetching
        }));
        setFoodItems(newFoodItems);
        toast({ title: "Estimation Successful!", description: `${newFoodItems.length} food item(s) identified. Fetching details...`, variant: "default" });

        // Add to history
        const totalCalories = newFoodItems.reduce((sum, item) => sum + item.estimatedCalories, 0);
        addHistoryEntry({
          uploadedImage: dataUri,
          foodItems: newFoodItems.map(fi => ({ name: fi.name, estimatedCalories: fi.estimatedCalories })),
          totalCalories,
        });
        
        // Fetch accompaniments for each item
        newFoodItems.forEach(item => fetchAccompaniments(item.id, item.name));

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        console.error("Estimation failed:", e);
        setError(`Estimation failed: ${errorMessage}`);
        toast({ title: "Estimation Error", description: errorMessage, variant: "destructive" });
      }
    });
  };

  const handleViewDetails = (item: FoodItem) => {
    setSelectedFoodItemForDialog(item);
    setIsDialogOpen(true);
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + item.estimatedCalories, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl bg-card">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
        <Sparkles className="inline-block mr-2 h-7 w-7 sm:h-8 sm:w-8 text-accent" />
        CalorieCam: Snap & Estimate
      </h1>
      
      <ImageUpload onImageSelected={handleImageSelected} currentImagePreviewUrl={imagePreviewUrl} />

      {isEstimating && (
        <div className="space-y-2">
          <Progress value={undefined} className="w-full [&>div]:bg-primary" /> {/* Indeterminate */}
          <p className="text-sm text-center text-muted-foreground">Analyzing your meal, please wait...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!selectedFile || isEstimating}
        className="w-full text-lg py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
      >
        {isEstimating ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        Estimate Calories
      </Button>

      {!isEstimating && foodItems.length > 0 && (
        <ResultsDisplay foodItems={foodItems} onViewDetails={handleViewDetails} totalCalories={totalCalories} />
      )}
      
      {!isEstimating && foodItems.length === 0 && !error && selectedFile && (
         <div className="mt-8 text-center text-muted-foreground">
            <p>Click "Estimate Calories" to process the selected image.</p>
         </div>
      )}


      <AccompanimentsDialog
        foodItem={selectedFoodItemForDialog}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
