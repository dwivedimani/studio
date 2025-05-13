
'use server';

import { analyzeSymptoms, type AnalyzeSymptomsInput, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { findPharmacies, type FindPharmaciesInput, type FindPharmaciesOutput } from '@/ai/flows/find-pharmacies-flow';
import { findDoctors, type FindDoctorsInput, type FindDoctorsOutput } from '@/ai/flows/find-doctors-flow';
import { findPathologyLabs, type FindPathologyLabsInput, type FindPathologyLabsOutput } from '@/ai/flows/find-pathology-labs-flow';
import { findHospitals, type FindHospitalsInput, type FindHospitalsOutput } from '@/ai/flows/find-hospitals-flow';
import { z } from 'zod';
import type { LanguageCode } from '@/contexts/LanguageContext'; // Import LanguageCode

const SymptomSchema = z.object({
  symptoms: z.string().min(10, { message: 'validationMinChars|{"count":10}' }).max(1000, {message: 'validationMaxChars|{"count":1000}'}),
});

export interface FormState {
  message: string;
  analysis?: AnalyzeSymptomsOutput; 
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
  const lang = (formData.get('language') as LanguageCode) || 'en';
  const rawFormData = {
    symptoms: formData.get('symptoms'),
  };

  const validatedFields = SymptomSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: AnalyzeSymptomsInput = { 
      symptoms: validatedFields.data.symptoms,
      language: lang 
    };
    const result = await analyzeSymptoms(input);
    return {
      message: 'Symptoms analyzed successfully.', // This message is not typically translated as it's for internal state logic
      analysis: result, 
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'errorDuringAnalysisMessage',
      errors: { _form: [`symptomAnalysisFailed|{"error":"${errorMessage}"}`] },
      timestamp: Date.now(),
    };
  }
}


const LocationSchema = z.object({
  location: z.string().min(3, { message: 'validationLocationMinChars|{"count":3}' }).max(100, {message: 'validationLocationMaxChars|{"count":100}'}),
});

const DoctorLocationSchema = LocationSchema.extend({
    specialty: z.string().max(100, {message: 'validationSpecialtyMaxChars|{"count":100}'}).optional().nullable(), 
});


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
  const lang = (formData.get('language') as LanguageCode) || 'en';
  const rawFormData = {
    location: formData.get('location'),
  };

  const validatedFields = LocationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: FindPharmaciesInput = { 
      location: validatedFields.data.location,
      language: lang
    };
    const result = await findPharmacies(input);
    return {
      message: 'searchCompletedMessage|{"entity":"Pharmacies"}',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find pharmacies error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'errorDuringSearchMessage|{"entity_plural":"pharmacies"}',
      errors: { _form: [`searchFailed|{"entity":"Pharmacy", "error":"${errorMessage}"}`] },
      timestamp: Date.now(),
    };
  }
}

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
  const lang = (formData.get('language') as LanguageCode) || 'en';
  const rawFormData = {
    location: formData.get('location'),
    specialty: formData.get('specialty') || undefined, 
  };
  
  const validatedFields = DoctorLocationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }
  
  const input: FindDoctorsInput = { 
    location: validatedFields.data.location,
    specialty: validatedFields.data.specialty ? validatedFields.data.specialty : undefined, 
    language: lang,
  };

  try {
    const result = await findDoctors(input);
    return {
      message: 'searchCompletedMessage|{"entity":"Doctors"}',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find doctors error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'errorDuringSearchMessage|{"entity_plural":"doctors"}',
      errors: { _form: [`searchFailed|{"entity":"Doctor", "error":"${errorMessage}"}`] },
      timestamp: Date.now(),
    };
  }
}

// State for Find Pathology Labs
export interface FindPathologyLabsFormState {
  message: string;
  data?: FindPathologyLabsOutput;
  errors?: {
    location?: string[];
    _form?: string[];
  };
  timestamp: number;
}

export async function handleFindPathologyLabs(
  prevState: FindPathologyLabsFormState,
  formData: FormData
): Promise<FindPathologyLabsFormState> {
  const lang = (formData.get('language') as LanguageCode) || 'en';
  const rawFormData = {
    location: formData.get('location'),
  };

  const validatedFields = LocationSchema.safeParse(rawFormData); 

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: FindPathologyLabsInput = { 
      location: validatedFields.data.location,
      language: lang 
    };
    const result = await findPathologyLabs(input);
    return {
      message: 'searchCompletedMessage|{"entity":"Pathology Labs"}',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find pathology labs error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'errorDuringSearchMessage|{"entity_plural":"pathology labs"}',
      errors: { _form: [`searchFailed|{"entity":"Pathology Lab", "error":"${errorMessage}"}`] },
      timestamp: Date.now(),
    };
  }
}

// State for Find Hospitals
export interface FindHospitalsFormState {
  message: string;
  data?: FindHospitalsOutput;
  errors?: {
    location?: string[];
    _form?: string[];
  };
  timestamp: number;
}

export async function handleFindHospitals(
  prevState: FindHospitalsFormState,
  formData: FormData
): Promise<FindHospitalsFormState> {
  const lang = (formData.get('language') as LanguageCode) || 'en';
  const rawFormData = {
    location: formData.get('location'),
  };

  const validatedFields = LocationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  try {
    const input: FindHospitalsInput = { 
      location: validatedFields.data.location,
      language: lang 
    };
    const result = await findHospitals(input);
    return {
      message: 'searchCompletedMessage|{"entity":"Hospitals"}',
      data: result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('AI find hospitals error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'errorDuringSearchMessage|{"entity_plural":"hospitals"}',
      errors: { _form: [`searchFailed|{"entity":"Hospital", "error":"${errorMessage}"}`] },
      timestamp: Date.now(),
    };
  }
}

