'use server';

import { analyzeSymptoms, type AnalyzeSymptomsInput, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { z } from 'zod';

const SymptomSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in at least 10 characters.' }).max(1000, {message: 'Symptoms description cannot exceed 1000 characters.'}),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeSymptomsOutput;
  errors?: {
    symptoms?: string[];
    _form?: string[]; // For general form errors
  };
  timestamp: number; // To help React detect state changes
}

export async function handleSymptomAnalysis(
  prevState: FormState, // Keep prevState for potential future use, even if not directly used for merging now
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    symptoms: formData.get('symptoms'),
  };

  const validatedFields = SymptomSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: AnalyzeSymptomsInput = { symptoms: validatedFields.data.symptoms };
    const result = await analyzeSymptoms(input);
    return {
      message: 'Symptoms analyzed successfully.',
      analysis: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'An error occurred during symptom analysis. Please try again later.',
      errors: { _form: [`Symptom analysis failed: ${errorMessage}`] },
      timestamp: Date.now(),
    };
  }
}
