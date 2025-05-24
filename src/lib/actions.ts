// src/lib/actions.ts
"use server";

import { estimateFoodCalories, EstimateFoodCaloriesInput, EstimateFoodCaloriesOutput } from "@/ai/flows/estimate-food-calories";
import { suggestFoodAccompaniments, SuggestFoodAccompanimentsInput, SuggestFoodAccompanimentsOutput } from "@/ai/flows/suggest-food-accompaniments";
import { analyzeMealNutrients, AnalyzeMealNutrientsInput, AnalyzeMealNutrientsOutput } from "@/ai/flows/analyze-meal-nutrients";
import type { RawEstimateFoodCaloriesOutput } from "@/lib/types";

export async function getCalorieEstimationAction(
  photoDataUri: string
): Promise<EstimateFoodCaloriesOutput> {
  try {
    const input: EstimateFoodCaloriesInput = { photoDataUri };
    const result = await estimateFoodCalories(input) as unknown as RawEstimateFoodCaloriesOutput;
    
    if (!result || !Array.isArray(result.foodItems)) {
      console.error("Invalid response format from AI for calorie estimation. Result:", result);
      throw new Error("AI response for calorie estimation was not in the expected format.");
    }
    result.foodItems.forEach(item => {
      if (typeof item.name !== 'string' || typeof item.estimatedCalories !== 'number') {
        console.error("Invalid food item format in AI response. Item:", item);
        throw new Error("Invalid food item data received from AI.");
      }
    });

    return result as EstimateFoodCaloriesOutput;
  } catch (error) {
    console.error("Error in getCalorieEstimationAction:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to estimate calories: ${error.message}`);
    }
    throw new Error("An unknown error occurred while estimating calories.");
  }
}

export async function getFoodAccompanimentsAction(
  foodItemName: string
): Promise<SuggestFoodAccompanimentsOutput> {
  try {
    const input: SuggestFoodAccompanimentsInput = { foodItem: foodItemName };
    const result = await suggestFoodAccompaniments(input);
    if (!result || !Array.isArray(result.accompaniments)) {
       console.error("Invalid response format from AI for food accompaniments. Result:", result);
      throw new Error("AI response for food accompaniments was not in the expected format.");
    }
    return result;
  } catch (error) {
    console.error("Error in getFoodAccompanimentsAction:", error);
     if (error instanceof Error) {
      throw new Error(`Failed to suggest accompaniments: ${error.message}`);
    }
    throw new Error("An unknown error occurred while suggesting accompaniments.");
  }
}

export async function getNutrientAnalysisAction(
  input: AnalyzeMealNutrientsInput
): Promise<AnalyzeMealNutrientsOutput> {
    try {
        const result = await analyzeMealNutrients(input);
        if (!result || typeof result.lackingNutrients === 'undefined') { // Check for a key field
            console.error("Invalid response format from AI for nutrient analysis. Result:", result);
            throw new Error("AI response for nutrient analysis was not in the expected format.");
        }
        return result;
    } catch (error) {
        console.error("Error in getNutrientAnalysisAction:", error);
        if (error instanceof Error) {
            throw new Error(`Nutrient analysis failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during nutrient analysis.");
    }
}
