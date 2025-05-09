// 'use server';

/**
 * @fileOverview Analyzes user-provided symptoms and suggests potential over-the-counter medicines for informational purposes only.
 *
 * - analyzeSymptoms - A function that takes user-reported symptoms and returns a list of suggested medicines.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A description of the user's symptoms."),
});

export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  suggestedMedicines: z
    .array(z.string())
    .describe('A list of suggested over-the-counter medicines for informational purposes only. Not intended as medical advice.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer stating that the suggestions are for informational purposes only and not a substitute for professional medical advice.'
    ),
});

export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const analyzeSymptomsPrompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are a helpful assistant that analyzes a user's symptoms and suggests potential over-the-counter medicines for informational purposes only. Do not provide medical advice.

  Symptoms: {{{symptoms}}}

  Please provide a list of suggested medicines and a disclaimer that the suggestions are for informational purposes only and not a substitute for professional medical advice.

  Format your response as a JSON object with "suggestedMedicines" and "disclaimer" fields.
  `, 
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await analyzeSymptomsPrompt(input);
    return output!;
  }
);
