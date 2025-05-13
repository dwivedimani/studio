
// 'use server';

/**
 * @fileOverview Analyzes user-provided symptoms and suggests potential over-the-counter medicines with dosages and a relevant medical specialty for informational purposes only.
 *
 * - analyzeSymptoms - A function that takes user-reported symptoms and returns a list of suggested medicines, dosages, and a suggested specialty.
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
  language: z.string().optional().default('en').describe("The language for the AI response, e.g., 'en', 'es'. ISO 639-1 code."),
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
  suggestedSpecialty: z
    .string()
    .optional()
    .describe('A general medical specialty that might be relevant for the symptoms or suggested medicines (e.g., "General Practitioner", "Dermatologist", "Allergist"). This is an AI-generated suggestion and might not always be provided.'),
});

export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const analyzeSymptomsPrompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are a helpful assistant that analyzes a user's symptoms. Based on these symptoms, you will:
1. Suggest potential over-the-counter medicines, including general dosage information.
2. Suggest a general medical specialty that a person might consider consulting for such symptoms (e.g., "General Practitioner", "Dermatologist", "Pulmonologist"). If the symptoms are very generic or don't clearly point to a specialty, you can omit this or suggest "General Practitioner".
3. Provide a disclaimer.

Your response MUST be in the language specified by the code: {{{language}}}.
(For example, if 'es', respond in Spanish. If 'fr', respond in French. Default to English if language is 'en' or not explicitly supported.)

Symptoms: {{{symptoms}}}

Please provide:
- A list of suggested medicines, each with a 'name' and a 'dosage'.
- A 'suggestedSpecialty' if applicable.
- A 'disclaimer' stating that these suggestions are for informational purposes only, not a substitute for professional medical advice, dosages are general, and users should read labels and consult a healthcare professional. 
ALL parts of your response, including medicine names, dosages, specialty, and the disclaimer, must be in the language: {{{language}}}.

Format your response as a JSON object according to the output schema. Ensure the language of the content in the JSON fields (name, dosage, disclaimer, suggestedSpecialty) matches the requested {{{language}}}.
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

