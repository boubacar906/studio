import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-food-accompaniments.ts';
import '@/ai/flows/estimate-food-calories.ts';
import '@/ai/flows/analyze-meal-nutrients.ts'; // Added new flow
