'use server';
/**
 * @fileOverview Analyzes a list of meal items to provide nutrient suggestions.
 *
 * - analyzeMealNutrients - A function that handles the nutrient analysis process.
 * - AnalyzeMealNutrientsInput - The input type for the analyzeMealNutrients function.
 * - AnalyzeMealNutrientsOutput - The return type for the analyzeMealNutrients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodItemSchema = z.object({
  name: z.string().describe('The name of the food item or meal. Could be a comma-separated list if multiple items in one meal entry.'),
  quantity: z.string().optional().describe('The quantity or portion size of the food item (e.g., "1 cup", "100g").'),
  calories: z.number().optional().describe('The estimated calorie count for the food item.'),
});

const AnalyzeMealNutrientsInputSchema = z.object({
  foodItems: z.array(FoodItemSchema).describe('A list of food items consumed, including their names, and optionally quantity and calories.'),
});
export type AnalyzeMealNutrientsInput = z.infer<typeof AnalyzeMealNutrientsInputSchema>;

const AnalyzeMealNutrientsOutputSchema = z.object({
  lackingNutrients: z.array(
    z.object({
      nutrient: z.string().describe('The name of the nutrient that might be lacking (e.g., Vitamin C, Iron, Fiber).'),
      suggestion: z.string().describe('A brief suggestion on how to incorporate this nutrient or foods rich in it.'),
    })
  ).describe('A list of nutrients that might be lacking based on the provided meals, along with suggestions.'),
  generalFeedback: z.string().optional().describe('Overall dietary feedback or general suggestions for improvement based on the meals.'),
});
export type AnalyzeMealNutrientsOutput = z.infer<typeof AnalyzeMealNutrientsOutputSchema>;

export async function analyzeMealNutrients(input: AnalyzeMealNutrientsInput): Promise<AnalyzeMealNutrientsOutput> {
  if (!input.foodItems || input.foodItems.length === 0) {
    return {
        lackingNutrients: [],
        generalFeedback: "No meal data provided to analyze. Please log some meals first."
    };
  }
  return analyzeMealNutrientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMealNutrientsPrompt',
  input: {schema: AnalyzeMealNutrientsInputSchema},
  output: {schema: AnalyzeMealNutrientsOutputSchema},
  prompt: `You are a helpful nutritionist AI. Analyze the following list of recently consumed food items.
Based on this list, identify up to 3-4 common nutrients that might be lacking in this diet pattern.
For each potentially lacking nutrient, provide a brief, actionable suggestion (e.g., "Consider adding citrus fruits or bell peppers for Vitamin C.").
Also, provide some brief general feedback on the overall meal pattern if appropriate. If the meal data is very generic (e.g. "Pizza"), make reasonable assumptions or state limitations.
Focus on common micronutrients (vitamins, minerals) and macronutrient balance (protein, fiber). Avoid making medical claims or diagnoses.

Consumed Food Items:
{{#each foodItems}}
- {{name}}{{#if quantity}} ({{quantity}}){{/if}}{{#if calories}} - approx. {{calories}} kcal{{/if}}
{{/each}}

Please return your analysis in the specified JSON format. If no specific concerns are found, the lackingNutrients array can be empty, but try to provide some general feedback.
If the food items list is very short or vague, acknowledge this limitation in your feedback.
`,
});

const analyzeMealNutrientsFlow = ai.defineFlow(
  {
    name: 'analyzeMealNutrientsFlow',
    inputSchema: AnalyzeMealNutrientsInputSchema,
    outputSchema: AnalyzeMealNutrientsOutputSchema,
  },
  async (input: AnalyzeMealNutrientsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
