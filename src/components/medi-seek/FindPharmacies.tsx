
"use client";

import React, { useActionState, useRef } from 'react';
import type { FindPharmaciesFormState } from '@/lib/actions';
import { handleFindPharmacies } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Search, Loader2, AlertTriangle, Phone, Clock, Building, AlertCircle } from 'lucide-react'; 
import { useLanguage } from '@/contexts/LanguageContext';

const initialPharmaciesState: FindPharmaciesFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? t('searchingButton') : t('searchButton')}
    </Button>
  );
}

export default function FindPharmacies() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleFindPharmacies, initialPharmaciesState);
  const formRef = useRef<HTMLFormElement>(null);

  const translateError = (errorMsg: string): string => {
    if (errorMsg.includes('|')) {
      const parts = errorMsg.split('|');
      const errorKey = parts[0];
      try {
        const params = parts[1] ? JSON.parse(parts[1]) : undefined;
        return t(errorKey, params);
      } catch (e) { return t(errorKey); }
    }
    return t(errorMsg);
  };

  const locationErrors = state.errors?.location?.map(translateError).join(', ');
  const formErrors = state.errors?._form?.map(translateError).join(', ');

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <MapPin className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
          {t('findPharmacies')}
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter a location to get AI-generated examples of pharmacies. This is for demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="language" value={language} />
          <div>
            <Label htmlFor="pharmacy-location" className="text-sm font-medium">{t('locationInputLabel')}</Label>
            <Input
              id="pharmacy-location"
              name="location"
              placeholder={t('locationPlaceholderPharmacies')}
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
              {t('aiGeneratedDataDisclaimer', { disclaimer: state.data.disclaimer, location: state.data.searchedLocation, specialtyString: '' })}
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">{t('generatedResultsTitle', { entity: t('findPharmacies') })}</h4>
          {state.data.pharmacies.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.pharmacies.map((pharmacy, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <p className="font-semibold text-primary-foreground flex items-center"><Building className="w-4 h-4 mr-2 text-primary/80"/>{pharmacy.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pharmacy.address}</p>
                  {pharmacy.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {pharmacy.phone}</p>}
                  {pharmacy.hours && <p className="text-xs text-muted-foreground flex items-center mt-1"><Clock className="w-3 h-3 mr-1.5 text-primary/70"/> {pharmacy.hours}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('noDataGenerated', { entity: t('findPharmacies').toLowerCase(), specialtyString: '' })}</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
