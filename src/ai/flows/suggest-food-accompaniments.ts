'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests typical food accompaniments for a given food item.
 *
 * - suggestFoodAccompaniments - A function that suggests typical food accompaniments for a given food item.
 * - SuggestFoodAccompanimentsInput - The input type for the suggestFoodAccompaniments function.
 * - SuggestFoodAccompanimentsOutput - The return type for the suggestFoodAccompaniments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFoodAccompanimentsInputSchema = z.object({
  foodItem: z.string().describe('The name of the food item.'),
});
export type SuggestFoodAccompanimentsInput = z.infer<typeof SuggestFoodAccompanimentsInputSchema>;

const SuggestFoodAccompanimentsOutputSchema = z.object({
  accompaniments: z
    .array(z.string())
    .describe('An array of typical food accompaniments for the given food item.'),
});
export type SuggestFoodAccompanimentsOutput = z.infer<typeof SuggestFoodAccompanimentsOutputSchema>;

export async function suggestFoodAccompaniments(
  input: SuggestFoodAccompanimentsInput
): Promise<SuggestFoodAccompanimentsOutput> {
  return suggestFoodAccompanimentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFoodAccompanimentsPrompt',
  input: {schema: SuggestFoodAccompanimentsInputSchema},
  output: {schema: SuggestFoodAccompanimentsOutputSchema},
  prompt: `You are a food expert. Suggest common food accompaniments for the following food item. Return a list of strings.

Food Item: {{{foodItem}}}`,
});

const suggestFoodAccompanimentsFlow = ai.defineFlow(
  {
    name: 'suggestFoodAccompanimentsFlow',
    inputSchema: SuggestFoodAccompanimentsInputSchema,
    outputSchema: SuggestFoodAccompanimentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
