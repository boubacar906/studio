
import type { z } from 'zod';
import type { loginSchema, signupSchema } from '@/lib/schemas';


export interface EstimatedFoodItemAi {
  name: string;
  estimatedCalories: number;
}
export interface RawEstimateFoodCaloriesOutput {
  foodItems: EstimatedFoodItemAi[];
}

export interface FoodItem {
  id: string;
  name: string;
  estimatedCalories: number;
  accompaniments?: string[];
  isLoadingAccompaniments: boolean;
  errorAccompaniments?: string;
  info?: string; // For basic food information / nutritional caveats
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO date string
  uploadedImage: string; // Data URI of the full uploaded image
  foodItems: Pick<FoodItem, 'name' | 'estimatedCalories'>[];
  totalCalories: number;
}

// Auth Form Data Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
