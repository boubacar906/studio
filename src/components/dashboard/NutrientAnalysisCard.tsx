// src/components/dashboard/NutrientAnalysisCard.tsx
"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { analyzeMealNutrients, AnalyzeMealNutrientsInput, AnalyzeMealNutrientsOutput } from '@/ai/flows/analyze-meal-nutrients'; // Will be created

interface NutrientAnalysisCardProps {
  recentMeals: Array<{ name: string; estimatedCalories: number }>; // Simplified meal data
}

export function NutrientAnalysisCard({ recentMeals }: NutrientAnalysisCardProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMealNutrientsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, startAnalyzingTransition] = useTransition();

  const handleAnalyzeNutrients = async () => {
    if (recentMeals.length === 0) {
      setError("No recent meals to analyze. Please log some meals first.");
      return;
    }
    setError(null);
    setAnalysisResult(null);

    startAnalyzingTransition(async () => {
      try {
        const input: AnalyzeMealNutrientsInput = {
          // The flow expects an array of food items, let's pass simplified names for now
          foodItems: recentMeals.map(meal => ({ name: meal.name, quantity: "1 serving", calories: meal.estimatedCalories })),
        };
        const result = await analyzeMealNutrients(input);
        setAnalysisResult(result);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during nutrient analysis.";
        console.error("Nutrient analysis failed:", e);
        setError(errorMessage);
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-secondary h-6 w-6" />
          Nutrient Insights
        </CardTitle>
        <CardDescription>Get AI-powered suggestions based on your recent meals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing nutrients...</p>
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <div className="space-y-3">
            {analysisResult.generalFeedback && (
                 <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>General Feedback</AlertTitle>
                    <AlertDescription>{analysisResult.generalFeedback}</AlertDescription>
                </Alert>
            )}
            {analysisResult.lackingNutrients && analysisResult.lackingNutrients.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Potentially Lacking Nutrients:</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-muted-foreground">
                  {analysisResult.lackingNutrients.map((item, index) => (
                    <li key={index}>
                      <span className="font-semibold text-foreground">{item.nutrient}:</span> {item.suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(!analysisResult.lackingNutrients || analysisResult.lackingNutrients.length === 0) && !analysisResult.generalFeedback && (
                <p className="text-sm text-muted-foreground">No specific nutrient concerns identified from the provided meal data. Keep up the balanced eating!</p>
            )}
          </div>
        )}

        {!analysisResult && !isAnalyzing && !error && (
           <p className="text-sm text-muted-foreground">
            {recentMeals.length > 0 ? "Click the button to analyze your recent meals for nutrient insights." : "Log some meals to enable nutrient analysis."}
          </p>
        )}

        <Button
          onClick={handleAnalyzeNutrients}
          disabled={isAnalyzing || recentMeals.length === 0}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analyze Recent Meals
        </Button>
      </CardContent>
    </Card>
  );
}
