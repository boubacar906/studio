// src/components/nutrient-analysis/NutrientAnalysisClientContent.tsx
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, AlertCircle, Lightbulb, HelpCircle, Info } from 'lucide-react';
import { analyzeMealNutrients, AnalyzeMealNutrientsInput, AnalyzeMealNutrientsOutput } from '@/ai/flows/analyze-meal-nutrients';
import { useHistory } from '@/hooks/useHistory';
import { HistoryEntry } from '@/lib/types'; // Assuming HistoryEntry has foodItems with name and estimatedCalories

export function NutrientAnalysisClientContent() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMealNutrientsOutput | null>(null);
  const [manualMealInput, setManualMealInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, startAnalyzingTransition] = useTransition();
  const { history, isHistoryLoading } = useHistory();

  const prepareFoodItemsFromHistory = (selectedHistory: HistoryEntry[]): AnalyzeMealNutrientsInput['foodItems'] => {
    return selectedHistory.flatMap(entry => 
      entry.foodItems.map(item => ({
        name: item.name,
        calories: item.estimatedCalories,
        quantity: "1 serving" // Placeholder quantity
      }))
    );
  };
  
  const prepareFoodItemsFromManualInput = (text: string): AnalyzeMealNutrientsInput['foodItems'] => {
    // Basic parsing: assumes each line is a meal item.
    // Could be improved with more sophisticated parsing or structured input.
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(name => ({ name, quantity: "1 serving" })); // Placeholder quantity
  };


  const handleAnalyze = async (source: 'history' | 'manual') => {
    setError(null);
    setAnalysisResult(null);
    let foodItemsToAnalyze: AnalyzeMealNutrientsInput['foodItems'] = [];

    if (source === 'history') {
      if (history.length === 0) {
        setError("No meal history available to analyze. Please log some meals or enter manually.");
        return;
      }
      // For simplicity, let's analyze the last 5 meals from history or all if less than 5
      const recentHistory = history.slice(0, 5); 
      foodItemsToAnalyze = prepareFoodItemsFromHistory(recentHistory);
    } else { // manual input
      if (!manualMealInput.trim()) {
        setError("Please enter some meal details to analyze.");
        return;
      }
      foodItemsToAnalyze = prepareFoodItemsFromManualInput(manualMealInput);
    }
    
    if (foodItemsToAnalyze.length === 0) {
        setError("No valid meal items found to analyze.");
        return;
    }

    startAnalyzingTransition(async () => {
      try {
        const input: AnalyzeMealNutrientsInput = { foodItems: foodItemsToAnalyze };
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary h-7 w-7 sm:h-8 sm:w-8" />
            Detailed Nutrient Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Get AI-powered insights into your diet. Analyze meals from your history or enter them manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="manualMealInput" className="text-lg font-medium">Enter Meals Manually (optional)</Label>
            <Textarea
              id="manualMealInput"
              placeholder="e.g., Chicken Salad, Apple with Peanut Butter, Oatmeal with Berries..."
              value={manualMealInput}
              onChange={(e) => setManualMealInput(e.target.value)}
              rows={4}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Enter one meal or food item per line. The more details you provide (e.g., "Large salad with grilled chicken, mixed greens, tomatoes, cucumbers, olive oil dressing"), the better the analysis.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleAnalyze('history')}
              disabled={isAnalyzing || isHistoryLoading || history.length === 0}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
              Analyze Recent History ({history.length > 0 ? Math.min(history.length, 5) : 0} Meals)
            </Button>
            <Button
              onClick={() => handleAnalyze('manual')}
              disabled={isAnalyzing || !manualMealInput.trim()}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isAnalyzing && manualMealInput.trim() ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Analyze Manual Input
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <div className="flex items-center justify-center p-6 bg-card rounded-lg shadow">
          <Loader2 className="mr-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Performing nutrient analysis, please wait...</p>
        </div>
      )}

      {error && !isAnalyzing && (
        <Alert variant="destructive" className="shadow">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Analysis Error</AlertTitle>
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && !isAnalyzing && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <Info className="text-accent h-6 w-6"/>
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult.generalFeedback && (
              <Alert className="bg-primary/5 border-primary/20">
                <Lightbulb className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-medium text-primary">General Dietary Feedback</AlertTitle>
                <AlertDescription className="text-base">{analysisResult.generalFeedback}</AlertDescription>
              </Alert>
            )}
            {analysisResult.lackingNutrients && analysisResult.lackingNutrients.length > 0 ? (
              <div>
                <h4 className="text-lg font-medium text-foreground mb-2">Potentially Lacking Nutrients & Suggestions:</h4>
                <ul className="space-y-3">
                  {analysisResult.lackingNutrients.map((item, index) => (
                    <li key={index} className="p-3 bg-card rounded-md border border-border shadow-sm">
                      <p className="text-md font-semibold text-foreground">{item.nutrient}</p>
                      <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-md text-muted-foreground">
                {!analysisResult.generalFeedback ? "No specific nutrient concerns highlighted from the provided data. This could mean your diet is well-balanced or the provided meal descriptions were too general for detailed analysis." : "No specific lacking nutrients highlighted beyond the general feedback."}
              </p>
            )}
            <Alert variant="default" className="bg-accent/5 border-accent/20">
                <HelpCircle className="h-5 w-5 text-accent"/>
                <AlertTitle className="text-md font-medium text-accent">Disclaimer</AlertTitle>
                <AlertDescription className="text-sm">
                    This analysis is AI-generated based on limited information and is for informational purposes only. It is not a substitute for professional medical or nutritional advice. Consult with a healthcare professional or registered dietitian for personalized guidance.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
