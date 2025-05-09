'use server';

import { analyzeSymptoms, type AnalyzeSymptomsInput, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { findPharmacies, type FindPharmaciesInput, type FindPharmaciesOutput } from '@/ai/flows/find-pharmacies-flow';
import { findDoctors, type FindDoctorsInput, type FindDoctorsOutput } from '@/ai/flows/find-doctors-flow';
import { z } from 'zod';

const SymptomSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in at least 10 characters.' }).max(1000, {message: 'Symptoms description cannot exceed 1000 characters.'}),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeSymptomsOutput; // This includes suggestedMedicines, disclaimer, and potentially suggestedSpecialty
  errors?: {
    symptoms?: string[];
    _form?: string[]; 
  };
  timestamp: number; 
}

export async function handleSymptomAnalysis(
  prevState: FormState, 
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
    // result now contains analysis.suggestedSpecialty if provided by the AI
    return {
      message: 'Symptoms analyzed successfully.',
      analysis: result, 
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'An error occurred during symptom analysis. Please try again later.',
      errors: { _form: [`Symptom analysis failed: ${errorMessage}`] },
      timestamp: Date.now(),
    };
  }
}


// Schema for Find Pharmacies/Doctors Location Input
const LocationSchema = z.object({
  location: z.string().min(3, { message: 'Please enter a location (e.g., city or zip code) with at least 3 characters.' }).max(100, {message: 'Location input cannot exceed 100 characters.'}),
});

const DoctorLocationSchema = LocationSchema.extend({
    specialty: z.string().max(100, {message: 'Specialty input cannot exceed 100 characters.'}).optional().nullable(), // Allow empty string from form, which will be treated as undefined later
});


// State for Find Pharmacies
export interface FindPharmaciesFormState {
  message: string;
  data?: FindPharmaciesOutput;
  errors?: {
    location?: string[];
    _form?: string[];
  };
  timestamp: number;
}

export async function handleFindPharmacies(
  prevState: FindPharmaciesFormState,
  formData: FormData
): Promise<FindPharmaciesFormState> {
  const rawFormData = {
    location: formData.get('location'),
  };

  const validatedFields = LocationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check the location input.',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: FindPharmaciesInput = { location: validatedFields.data.location };
    const result = await findPharmacies(input);
    return {
      message: 'Pharmacies search completed.',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find pharmacies error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'An error occurred while searching for pharmacies.',
      errors: { _form: [`Pharmacy search failed: ${errorMessage}`] },
      timestamp: Date.now(),
    };
  }
}

// State for Find Doctors
export interface FindDoctorsFormState {
  message: string;
  data?: FindDoctorsOutput;
  errors?: {
    location?: string[];
    specialty?: string[];
    _form?: string[];
  };
  timestamp: number;
}

export async function handleFindDoctors(
  prevState: FindDoctorsFormState,
  formData: FormData
): Promise<FindDoctorsFormState> {
  const rawFormData = {
    location: formData.get('location'),
    specialty: formData.get('specialty') || undefined, 
  };
  
  const validatedFields = DoctorLocationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check the location and specialty input.',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }
  
  const input: FindDoctorsInput = { 
    location: validatedFields.data.location,
    // Ensure empty string or null from form becomes undefined for the AI flow
    specialty: validatedFields.data.specialty ? validatedFields.data.specialty : undefined, 
  };

  try {
    const result = await findDoctors(input);
    return {
      message: 'Doctors search completed.',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find doctors error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'An error occurred while searching for doctors.',
      errors: { _form: [`Doctor search failed: ${errorMessage}`] },
      timestamp: Date.now(),
    };
  }
}
