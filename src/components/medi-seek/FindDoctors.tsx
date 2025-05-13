
"use client";

import React, { useActionState, useRef, useState, useEffect } from 'react';
import type { FindDoctorsFormState } from '@/lib/actions';
import { handleFindDoctors } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, Search, Loader2, AlertTriangle, Phone, Building, AlertCircle } from 'lucide-react'; 
import { useLanguage } from '@/contexts/LanguageContext';

const initialDoctorsState: FindDoctorsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? t('searchingButton') : t('searchButton')}
    </Button>
  );
}

export default function FindDoctors() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleFindDoctors, initialDoctorsState);
  const formRef = useRef<HTMLFormElement>(null);
  const [doctorSpecialtyValue, setDoctorSpecialtyValue] = useState('');

  // Helper to translate error messages
  const translateError = (errorMsg: string): string => {
    if (errorMsg.includes('|')) {
      const parts = errorMsg.split('|');
      const errorKey = parts[0];
      try {
        const params = parts[1] ? JSON.parse(parts[1]) : undefined;
        return t(errorKey, params);
      } catch (e) {
        return t(errorKey); 
      }
    }
    return t(errorMsg); 
  };

  const locationErrors = state.errors?.location?.map(translateError).join(', ');
  const specialtyErrors = state.errors?.specialty?.map(translateError).join(', ');
  const formErrors = state.errors?._form?.map(translateError).join(', ');

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <Stethoscope className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
          {t('findDoctors')}
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          {/* This description can be translated if needed, add to JSON files */}
          Enter location &amp; optionally specialty. For demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="language" value={language} />
          <div>
            <Label htmlFor="doctor-location" className="text-sm font-medium">{t('locationInputLabel')}</Label>
            <Input
              id="doctor-location"
              name="location"
              placeholder={t('locationPlaceholderDoctors')}
              className="mt-1"
              required
            />
            {locationErrors && (
               <Alert variant="destructive" className="mt-2 text-xs">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{locationErrors}</AlertDescription>
              </Alert>
            )}
          </div>
          <div>
            <Label htmlFor="doctor-specialty" className="text-sm font-medium">{t('specialtyInputLabel')}</Label>
            <Input
              id="doctor-specialty"
              name="specialty"
              placeholder={t('specialtyPlaceholder')}
              className="mt-1"
              value={doctorSpecialtyValue}
              onChange={(e) => setDoctorSpecialtyValue(e.target.value)}
            />
             {specialtyErrors && (
               <Alert variant="destructive" className="mt-2 text-xs">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{specialtyErrors}</AlertDescription>
              </Alert>
            )}
          </div>
          <SubmitButton pending={pending} />
        </form>

        {formErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold">{t('searchErrorTitle')}</AlertTitle>
            <AlertDescription>{formErrors}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      {state.data && (
        <CardFooter className="flex-col items-start p-4 sm:p-6 border-t bg-card">
           <Alert variant="default" className="mb-4 bg-accent/20 border-accent text-accent-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold text-accent-foreground">{t('aiGeneratedDataTitle')}</AlertTitle>
            <AlertDescription className="text-xs">
              {t('aiGeneratedDataDisclaimer', { 
                disclaimer: state.data.disclaimer, 
                location: state.data.searchedLocation,
                specialtyString: state.data.searchedSpecialty ? `, Specialty: ${state.data.searchedSpecialty}` : ''
              })}
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">{t('generatedResultsTitle', { entity: t('findDoctors') })}</h4>
          {state.data.doctors.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.doctors.map((doctor, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <p className="font-semibold text-primary-foreground flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-primary/80"/>{doctor.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Specialty: {doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doctor.address}</p>
                  {doctor.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {doctor.phone}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('noDataGenerated', { 
                entity: t('findDoctors').toLowerCase(), 
                specialtyString: state.data.searchedSpecialty ? ` for specialty ${state.data.searchedSpecialty}` : '' 
              })}
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
