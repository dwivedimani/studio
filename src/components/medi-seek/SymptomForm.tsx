
"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SymptomFormProps {
  formAction: (payload: FormData) => void;
  serverState: FormState; 
}

function SubmitButton() {
  const { t, language } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105">
      {pending ? (
        <>
          <Loader2 className={cn("h-4 w-4 animate-spin", language === 'ar' ? "ml-2" : "mr-2")} /> {t('analyzingButton')}
        </>
      ) : (
        t('analyzeSymptomsButton')
      )}
    </Button>
  );
}

export default function SymptomForm({ formAction, serverState }: SymptomFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { language, t } = useLanguage();

  React.useEffect(() => {
    if (serverState.message === 'Symptoms analyzed successfully.' && serverState.analysis) {
      // formRef.current?.reset(); 
    }
  }, [serverState]);

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

  const symptomErrors = serverState.errors?.symptoms?.map(translateError).join(', ');

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <input type="hidden" name="language" value={language} />
      <div>
        <Label htmlFor="symptoms" className="block text-sm font-medium text-foreground mb-2">
          {t('describeSymptomsLabel')}
        </Label>
        <Textarea
          id="symptoms"
          name="symptoms"
          rows={6}
          className="w-full rounded-lg shadow-sm border-border focus:ring-accent focus:border-accent placeholder:text-muted-foreground/80"
          placeholder={t('symptomsPlaceholder')}
          aria-describedby="symptoms-error"
          required
          defaultValue={formRef.current?.symptoms?.value || ''} 
        />
        {symptomErrors && (
          <Alert variant="destructive" className="mt-2 rounded-md" id="symptoms-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {symptomErrors}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className={cn("flex", language === 'ar' ? "justify-start" : "justify-end")}>
        <SubmitButton />
      </div>
    </form>
  );
}
