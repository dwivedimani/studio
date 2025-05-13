
"use client";

import React, { useActionState, useRef } from 'react';
import type { FindHospitalsFormState } from '@/lib/actions';
import { handleFindHospitals } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HospitalIcon, Search, Loader2, AlertTriangle, Phone, Building, AlertCircle, HeartPulse, Star } from 'lucide-react'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const initialHospitalsState: FindHospitalsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  const { t, language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className={cn("animate-spin", language === 'ar' ? "ml-2" : "mr-2")} /> : <Search className={cn(language === 'ar' ? "ml-2" : "mr-2")} />}
      {pending ? t('searchingButton') : t('searchButton')}
    </Button>
  );
}

export default function FindHospitals() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleFindHospitals, initialHospitalsState);
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

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />)}
         <span className={cn("text-xs text-muted-foreground", language === 'ar' ? "mr-1" : "ml-1")}>({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <HospitalIcon className={cn("h-6 w-6 sm:h-7 sm:w-7", language === 'ar' ? "ml-3" : "mr-3")} /> 
          {t('findHospitals')}
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter a location for AI-generated examples of hospitals. For demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="language" value={language} />
          <div>
            <Label htmlFor="hospital-location" className="text-sm font-medium">{t('locationInputLabel')}</Label>
            <Input
              id="hospital-location"
              name="location"
              placeholder={t('locationPlaceholderHospitals')}
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
            <AlertTitle className="font-semibold">{t('searchErrorTitle')}</AlertTitle> {/* Add 'searchErrorTitle' to locales if not present */}
            <AlertDescription>{formErrors}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      {state.data && (
        <CardFooter className="flex-col items-start p-4 sm:p-6 border-t bg-card">
          <Alert variant="default" className="mb-4 bg-accent/20 border-accent text-accent-foreground">
            <AlertTriangle className={cn("h-4 w-4 text-accent", language === 'ar' ? "ml-2" : "mr-2")} />
            <AlertTitle className="font-semibold text-accent-foreground">{t('aiGeneratedDataTitle')}</AlertTitle>
            <AlertDescription className="text-xs">
               {t('aiGeneratedDataDisclaimer', { disclaimer: state.data.disclaimer, location: state.data.searchedLocation, specialtyString: '' })}
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">{t('generatedResultsTitle', { entity: t('findHospitals') })}</h4>
          {state.data.hospitals.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.hospitals.map((hospital, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-primary-foreground flex items-center"><Building className={cn("w-4 h-4 text-primary/80", language === 'ar' ? "ml-2" : "mr-2")}/>{hospital.name}</p>
                    {hospital.rating && renderStars(hospital.rating)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{hospital.address}</p>
                  {hospital.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className={cn("w-3 h-3 text-primary/70", language === 'ar' ? "ml-1.5" : "mr-1.5")}/> {hospital.phone}</p>}
                  {hospital.emergencyServices !== undefined && (
                    <p className={`text-xs flex items-center mt-1 ${hospital.emergencyServices ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      <HeartPulse className={cn("w-3 h-3", language === 'ar' ? "ml-1.5" : "mr-1.5")}/> 
                      {language === 'ar' ? 'خدمات الطوارئ: ' : 'Emergency Services: '}
                      {hospital.emergencyServices ? (language === 'ar' ? 'متوفرة' : 'Available') : (language === 'ar' ? 'غير محدد/غير متوفرة' : 'Not Specified/Unavailable')}
                    </p>
                  )}
                  {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-foreground">
                        {language === 'ar' ? 'التخصصات الرئيسية:' : 'Key Specialties:'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hospital.specialties.map(spec => (
                          <span key={spec} className="text-xs bg-primary/20 text-primary-foreground px-1.5 py-0.5 rounded-full">{spec}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('noDataGenerated', { entity: t('findHospitals').toLowerCase(), specialtyString: '' })}</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
