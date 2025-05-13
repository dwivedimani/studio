
"use client";

import React, { useState, useEffect, useActionState } from 'react';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import SymptomForm from '@/components/medi-seek/SymptomForm';
import MedicineDisplay from '@/components/medi-seek/MedicineDisplay';
import { handleSymptomAnalysis, type FormState } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardPenLine, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const initialState: FormState = {
  message: '',
  timestamp: Date.now(), 
};

export default function HomePage() {
  const { t, language } = useLanguage(); // Use language context
  const [state, formAction] = useActionState(handleSymptomAnalysis, initialState);
  const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState(Date.now()); 

  useEffect(() => {
    if (state.timestamp !== initialState.timestamp) { 
        setShowResults(true);
        if (state.analysis) {
            setKey(Date.now());
        }
    }
  }, [state.timestamp, state.analysis]);

  // Helper to translate error messages if they follow the pattern "key|{json_params}"
  const translateError = (errorMsg: string): string => {
    if (errorMsg.includes('|')) {
      const parts = errorMsg.split('|');
      const errorKey = parts[0];
      try {
        const params = parts[1] ? JSON.parse(parts[1]) : undefined;
        return t(errorKey, params);
      } catch (e) {
        // If JSON parsing fails, return the original key part or the full message
        return t(errorKey); 
      }
    }
    return t(errorMsg); // If no pipe, assume it's a direct key or plain message
  };
  
  const formErrors = state.errors?._form?.map(translateError).join(', ');


  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="w-full max-w-2xl space-y-8"> 
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-card">
              <div className="flex items-center space-x-4">
                <ClipboardPenLine className="h-10 w-10 text-accent" />
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-semibold">{t('symptomAnalyzerTitle')}</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                    {t('symptomAnalyzerDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <SymptomForm key={key} formAction={formAction} serverState={state} />
            </CardContent>
          </Card>

          {showResults && state.analysis && (
            <Card className="shadow-xl rounded-xl overflow-hidden animate-fadeIn">
              <CardHeader className="bg-accent/10">
                 <div className="flex items-center space-x-4">
                  <Info className="h-10 w-10 text-accent" />
                  <div>
                      <CardTitle className="text-2xl sm:text-3xl font-semibold text-accent">{t('analysisResultsTitle')}</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-accent/90 mt-1">
                        {t('analysisResultsDescription')}
                      </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <MedicineDisplay analysis={state.analysis} />
              </CardContent>
            </Card>
          )}
          {showResults && formErrors && (
             <Card className="shadow-lg rounded-xl animate-fadeIn border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center text-xl sm:text-2xl">
                  <AlertTriangle className="mr-3 h-7 w-7" />
                  {t('analysisErrorTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-destructive-foreground text-sm sm:text-base">{formErrors}</p>
                <p className="text-destructive-foreground/80 text-xs mt-2">If the problem persists, please try again later or contact support if available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

