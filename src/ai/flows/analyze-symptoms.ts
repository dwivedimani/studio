// 'use server';

/**
 * @fileOverview Analyzes user-provided symptoms and suggests potential over-the-counter medicines with dosages for informational purposes only.
 *
 * - analyzeSymptoms - A function that takes user-reported symptoms and returns a list of suggested medicines with dosages.
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

const MedicineSuggestionSchema = z.object({
  name: z.string().describe("The name of the suggested over-the-counter medicine."),
  dosage: z.string().describe("The suggested dosage for the medicine, e.g., '1-2 tablets every 4-6 hours'. This is a general suggestion and not medical advice."),
});

const AnalyzeSymptomsOutputSchema = z.object({
  suggestedMedicines: z
    .array(MedicineSuggestionSchema)
    .describe('A list of suggested over-the-counter medicines with their general dosages, for informational purposes only. Not intended as medical advice.'),
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
  prompt: `You are a helpful assistant that analyzes a user's symptoms and suggests potential over-the-counter medicines, including general dosage information, for informational purposes only. Do not provide medical advice.

  Symptoms: {{{symptoms}}}

  Please provide a list of suggested medicines, each with a 'name' and a 'dosage' (e.g., '1-2 tablets every 4-6 hours as needed, do not exceed 8 tablets in 24 hours').
  Also include a disclaimer that these suggestions are for informational purposes only and not a substitute for professional medical advice. Emphasize that dosages are general and users should always read product labels and consult a healthcare professional.

  Format your response as a JSON object with "suggestedMedicines" (an array of objects, each with "name" and "dosage") and "disclaimer" fields.
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
