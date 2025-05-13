
"use client";

import React, { useActionState, useRef } from 'react';
import type { FindPathologyLabsFormState } from '@/lib/actions';
import { handleFindPathologyLabs } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TestTube2, Search, Loader2, AlertTriangle, Phone, Clock, Building, AlertCircle, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const initialPathologyLabsState: FindPathologyLabsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  const { t, language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className={cn("animate-spin", language === 'ar' ? "ml-2" : "mr-2")} /> : <Search className={cn(language === 'ar' ? "ml-2" : "mr-2")} />}
      {pending ? t('searchingButton') : t('searchButton')}
    </Button>
  );
}

export default function FindPathologyLabs() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleFindPathologyLabs, initialPathologyLabsState);
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
          <TestTube2 className={cn("h-6 w-6 sm:h-7 sm:w-7", language === 'ar' ? "ml-3" : "mr-3")} />
          {t('findPathologyLabs')}
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter a location for AI-generated examples of pathology labs. For demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="language" value={language} />
          <div>
            <Label htmlFor="pathology-location" className="text-sm font-medium">{t('locationInputLabel')}</Label>
            <Input
              id="pathology-location"
              name="location"
              placeholder={t('locationPlaceholderPathology')}
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
            <AlertTitle className="font-semibold">{t('searchErrorTitle')}</AlertTitle> {/* Add 'searchErrorTitle' to locales */}
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
          <h4 className="text-lg font-semibold mb-2 text-foreground">{t('generatedResultsTitle', { entity: t('findPathologyLabs') })}</h4>
          {state.data.labs.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.labs.map((lab, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <p className="font-semibold text-primary-foreground flex items-center"><Building className={cn("w-4 h-4 text-primary/80", language === 'ar' ? "ml-2" : "mr-2")}/>{lab.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lab.address}</p>
                  {lab.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className={cn("w-3 h-3 text-primary/70", language === 'ar' ? "ml-1.5" : "mr-1.5")}/> {lab.phone}</p>}
                  {lab.operatingHours && <p className="text-xs text-muted-foreground flex items-center mt-1"><Clock className={cn("w-3 h-3 text-primary/70", language === 'ar' ? "ml-1.5" : "mr-1.5")}/> {lab.operatingHours}</p>}
                  {lab.servicesOffered && lab.servicesOffered.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-foreground flex items-center">
                        <FlaskConical className={cn("w-3 h-3 text-primary/70", language === 'ar' ? "ml-1.5" : "mr-1.5")}/> 
                        {language === 'ar' ? 'الخدمات المقدمة:' : 'Services Offered:'}
                      </p>
                      <ul className={cn("list-disc list-inside", language === 'ar' ? "pr-1" : "pl-1")}>
                        {lab.servicesOffered.map(service => (
                           <li key={service} className="text-xs text-muted-foreground">{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t('noDataGenerated', { entity: t('findPathologyLabs').toLowerCase(), specialtyString: '' })}</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
