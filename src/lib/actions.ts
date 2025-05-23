
'use server';

import { analyzeSymptoms, type AnalyzeSymptomsInput, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { findPharmacies, type FindPharmaciesInput, type FindPharmaciesOutput } from '@/ai/flows/find-pharmacies-flow';
import { findDoctors, type FindDoctorsInput, type FindDoctorsOutput } from '@/ai/flows/find-doctors-flow';
import { findPathologyLabs, type FindPathologyLabsInput, type FindPathologyLabsOutput } from '@/ai/flows/find-pathology-labs-flow';
import { findHospitals, type FindHospitalsInput, type FindHospitalsOutput } from '@/ai/flows/find-hospitals-flow';
import { z } from 'zod';
import type { LanguageCode } from '@/contexts/LanguageContext';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { addPost as saveNewPost, deletePost as removePost, updatePost as saveUpdatedPost, getPostById, type NewBlogPost } from '@/lib/blog';
import { revalidatePath } from 'next/cache';


// Symptom Analysis
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
      message: 'Symptoms analyzed successfully.',
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

// Location-based searches
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

// Admin Authentication
const AdminLoginSchema = z.object({
  username: z.string().min(1, { message: 'adminUsernameRequired' }),
  password: z.string().min(1, { message: 'adminPasswordRequired' }),
  redirectTo: z.string().optional(), 
});

export interface AdminLoginFormState {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    _form?: string[];
  };
  timestamp: number;
}

export async function handleAdminLogin(
  prevState: AdminLoginFormState,
  formData: FormData
): Promise<AdminLoginFormState> {
  const rawFormData = {
    username: formData.get('username'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo'), 
  };

  const validatedFields = AdminLoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage', 
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { username, password, redirectTo } = validatedFields.data;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Adminuser';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Samsung123#_mcn';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies().set('admin-session', 'true', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    if (redirectTo && redirectTo.startsWith('/admin/') && redirectTo !== '/admin/login') {
      redirect(redirectTo);
    } else {
      redirect('/admin/dashboard'); 
    }
  } else {
    return {
      message: 'adminLoginFailed', 
      errors: { _form: ['adminInvalidCredentials'] },
      timestamp: Date.now(),
    };
  }
}


export async function handleAdminLogout() {
  cookies().delete('admin-session');
  redirect('/admin/login');
}


// Blog Post Creation & Update
const PostSchemaBase = z.object({
  title: z.string().min(5, { message: 'validationMinChars|{"count":5}' }).max(150, { message: 'validationMaxChars|{"count":150}' }),
  content: z.string().min(20, { message: 'validationMinChars|{"count":20}' }),
  author: z.string().optional(),
  excerpt: z.string().max(300, { message: 'validationMaxChars|{"count":300}' }).optional(),
});

const CreatePostSchema = PostSchemaBase;
const UpdatePostSchema = PostSchemaBase.extend({
  postId: z.string().min(1, { message: 'validationPostIdRequired' }),
});


export interface CreatePostFormState {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    author?: string[];
    excerpt?: string[];
    _form?: string[];
  };
  success?: boolean;
  timestamp: number;
}

export interface UpdatePostFormState extends CreatePostFormState {
  postId?: string;
  updatedSlug?: string;
}


export async function handleAddPost(
  prevState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const rawFormData: NewBlogPost = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string || undefined,
    excerpt: formData.get('excerpt') as string || undefined,
  };

  const validatedFields = CreatePostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
      success: false,
    };
  }

  try {
    await saveNewPost(validatedFields.data);
    revalidatePath('/admin/manage-blogs'); 
    revalidatePath('/blogs'); 
    revalidatePath('/blogs', 'layout'); // Revalidate the blog list page and its layout

    return {
      message: 'blogPostCreatedSuccess',
      timestamp: Date.now(),
      success: true,
    };
  } catch (error) {
    console.error('Blog post creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'blogPostCreationError',
      errors: { _form: [`blogPostCreationFailed|{"error":"${errorMessage}"}`] },
      timestamp: Date.now(),
      success: false,
    };
  }
}

export async function handleUpdatePost(
  prevState: UpdatePostFormState,
  formData: FormData
): Promise<UpdatePostFormState> {
  const rawFormData = {
    postId: formData.get('postId') as string,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string || undefined,
    excerpt: formData.get('excerpt') as string || undefined,
  };

  const validatedFields = UpdatePostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: 'validationFailedMessage',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
      success: false,
      postId: rawFormData.postId,
    };
  }
  
  const { postId, ...dataToUpdate } = validatedFields.data;

  try {
    const originalPost = await getPostById(postId);
    if (!originalPost) {
       return {
        message: 'blogPostUpdateErrorNotFound',
        errors: { _form: ['blogPostUpdateErrorNotFound'] },
        timestamp: Date.now(),
        success: false,
        postId: postId,
      };
    }

    const updatedPost = await saveUpdatedPost(postId, dataToUpdate);
    if (!updatedPost) {
      // This case might occur if saveUpdatedPost returns null on failure (e.g., post not found, which we checked)
      return {
        message: 'blogPostUpdateError',
        errors: { _form: ['blogPostUpdateFailed|{"error":"Post could not be updated."}'] },
        timestamp: Date.now(),
        success: false,
        postId: postId,
      };
    }

    // Revalidate paths
    revalidatePath('/admin/manage-blogs');
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${originalPost.slug}`); // Revalidate old slug path
    if (updatedPost.slug !== originalPost.slug) {
      revalidatePath(`/blogs/${updatedPost.slug}`); // Revalidate new slug path if changed
    }
    revalidatePath(`/admin/edit-post/${updatedPost.slug}`);


    // If the slug changed, we want to redirect to the new slug's edit page or manage page
    // For simplicity, let's redirect to manage-blogs after update.
    // Or, provide the new slug back to the form to potentially redirect client-side if needed.
    // For now, a success message and remaining on the page is fine.
    // To redirect, uncomment: redirect('/admin/manage-blogs');

    return {
      message: 'blogPostUpdatedSuccess',
      timestamp: Date.now(),
      success: true,
      postId: postId,
      updatedSlug: updatedPost.slug, // Send back the potentially new slug
    };
  } catch (error) {
    console.error('Blog post update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'blogPostUpdateError',
      errors: { _form: [`blogPostUpdateFailed|{"error":"${errorMessage}"}`] },
      timestamp: Date.now(),
      success: false,
      postId: postId,
    };
  }
}


// Delete Blog Post Action
export interface DeletePostFormState {
  message: string;
  success?: boolean;
  timestamp: number;
  errors?: {
    _form?: string[];
  };
}

export async function handleDeletePost(
  prevState: DeletePostFormState,
  formData: FormData
): Promise<DeletePostFormState> {
  const postId = formData.get('postId') as string;

  if (!postId) {
    return {
      message: 'blogPostErrorIdMissing',
      timestamp: Date.now(),
      success: false,
       errors: { _form: ['blogPostErrorIdMissing'] },
    };
  }

  try {
    // Fetch post before deleting to revalidate its path
    const postToDelete = await getPostById(postId);

    const deleted = await removePost(postId);
    if (deleted) {
      revalidatePath('/admin/manage-blogs');
      revalidatePath('/blogs');
      if (postToDelete) {
        revalidatePath(`/blogs/${postToDelete.slug}`);
      }
      return {
        message: 'blogPostDeletedSuccess',
        timestamp: Date.now(),
        success: true,
      };
    } else {
      return {
        message: 'blogPostDeletionErrorNotFound',
        timestamp: Date.now(),
        success: false,
        errors: { _form: ['blogPostDeletionErrorNotFound'] },
      };
    }
  } catch (error) {
    console.error('Blog post deletion error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'blogPostDeletionError',
      errors: { _form: [`blogPostDeletionFailed|{"error":"${errorMessage}"}`] },
      timestamp: Date.now(),
      success: false,
    };
  }
}

