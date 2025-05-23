// src/lib/actions.ts
"use server";

import { estimateFoodCalories, EstimateFoodCaloriesInput, EstimateFoodCaloriesOutput } from "@/ai/flows/estimate-food-calories";
import { suggestFoodAccompaniments, SuggestFoodAccompanimentsInput, SuggestFoodAccompanimentsOutput } from "@/ai/flows/suggest-food-accompaniments";
import type { RawEstimateFoodCaloriesOutput } from "@/lib/types";

export async function getCalorieEstimationAction(
  photoDataUri: string
): Promise<EstimateFoodCaloriesOutput> {
  try {
    const input: EstimateFoodCaloriesInput = { photoDataUri };
    // The AI flow might return a string that needs parsing, or already parsed JSON.
    // Assuming the flow returns the correct structured output.
    const result = await estimateFoodCalories(input) as unknown as RawEstimateFoodCaloriesOutput;
    
    // Validate and structure the output if necessary
    // For now, assume 'result' is already in EstimateFoodCaloriesOutput format
    // If not, you would parse/validate it here using Zod or manually.
    // Example of simple validation:
    if (!result || !Array.isArray(result.foodItems)) {
      throw new Error("Invalid response format from AI for calorie estimation.");
    }
    result.foodItems.forEach(item => {
      if (typeof item.name !== 'string' || typeof item.estimatedCalories !== 'number') {
        throw new Error("Invalid food item format in AI response.");
      }
    });

    return result as EstimateFoodCaloriesOutput;
  } catch (error) {
    console.error("Error in getCalorieEstimationAction:", error);
    // It's better to throw a custom error or return an error object
    // that the client can handle gracefully.
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
      throw new Error("Invalid response format from AI for food accompaniments.");
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
