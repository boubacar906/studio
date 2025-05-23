//Estimate food calories based on an image.
'use server';
/**
 * @fileOverview Estimates the calorie count of food items in an image.
 *
 * - estimateFoodCalories - A function that handles the calorie estimation process.
 * - EstimateFoodCaloriesInput - The input type for the estimateFoodCalories function.
 * - EstimateFoodCaloriesOutput - The return type for the estimateFoodCalories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateFoodCaloriesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EstimateFoodCaloriesInput = z.infer<typeof EstimateFoodCaloriesInputSchema>;

const EstimateFoodCaloriesOutputSchema = z.object({
  foodItems: z.array(
    z.object({
      name: z.string().describe('The name of the food item.'),
      estimatedCalories: z.number().describe('The estimated calorie count for the food item.'),
    })
  ).describe('A list of food items and their estimated calorie counts.'),
});
export type EstimateFoodCaloriesOutput = z.infer<typeof EstimateFoodCaloriesOutputSchema>;

export async function estimateFoodCalories(input: EstimateFoodCaloriesInput): Promise<EstimateFoodCaloriesOutput> {
  return estimateFoodCaloriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateFoodCaloriesPrompt',
  input: {schema: EstimateFoodCaloriesInputSchema},
  output: {schema: EstimateFoodCaloriesOutputSchema},
  prompt: `You are an expert nutritionist. Analyze the image of the meal and identify the food items present. Estimate the calorie count for each food item.

Image: {{media url=photoDataUri}}

Return a JSON object containing a list of food items and their estimated calorie counts.  Make sure that it conforms to the schema {{{{outputSchema}}}}.  Pay careful attention to datatypes for each field.  estimatedCalories MUST be a number. Do not include units.
`,
});

const estimateFoodCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateFoodCaloriesFlow',
    inputSchema: EstimateFoodCaloriesInputSchema,
    outputSchema: EstimateFoodCaloriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
