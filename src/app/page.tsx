"use client";

import React, { useState, useEffect, useActionState } from 'react';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import SymptomForm from '@/components/medi-seek/SymptomForm';
import MedicineDisplay from '@/components/medi-seek/MedicineDisplay';
import NearbyServices from '@/components/medi-seek/NearbyServices';
import { handleSymptomAnalysis, type FormState } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardPenLine, AlertTriangle, Info } from 'lucide-react';

const initialState: FormState = {
  message: '',
  timestamp: Date.now(), // Initialize with current time
};

export default function HomePage() {
  const [state, formAction] = useActionState(handleSymptomAnalysis, initialState);
  const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState(Date.now()); // Key for SymptomForm to reset on successful submission
  const [suggestedSpecialty, setSuggestedSpecialty] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Only show results if there's new analysis or errors from the latest submission
    if (state.timestamp !== initialState.timestamp) { 
        setShowResults(true);
        if (state.analysis) {
            // Reset form by changing key, which forces remount
            setKey(Date.now());
            setSuggestedSpecialty(state.analysis.suggestedSpecialty);
        } else {
            setSuggestedSpecialty(undefined); // Clear specialty if analysis fails or no specialty suggested
        }
    }
  }, [state.timestamp, state.analysis]);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column / Main Column: Symptom Input and Results */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-card">
                <div className="flex items-center space-x-4">
                  <ClipboardPenLine className="h-10 w-10 text-accent" />
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-semibold">Symptom Analyzer</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                      Describe your symptoms below. Our AI will provide informational suggestions for over-the-counter medicines and a relevant medical specialty.
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
                        <CardTitle className="text-2xl sm:text-3xl font-semibold text-accent-foreground">Analysis Results</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-accent-foreground/80 mt-1">
                          Please review the suggestions and disclaimer carefully.
                        </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <MedicineDisplay analysis={state.analysis} />
                </CardContent>
              </Card>
            )}
            {showResults && state.errors?._form && (
               <Card className="shadow-lg rounded-xl animate-fadeIn border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center text-xl sm:text-2xl">
                    <AlertTriangle className="mr-3 h-7 w-7" />
                    Analysis Error
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-destructive-foreground text-sm sm:text-base">{state.errors._form.join(', ')}</p>
                  <p className="text-destructive-foreground/80 text-xs mt-2">If the problem persists, please try again later or contact support if available.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column / Sidebar: Nearby Services */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-28"> {/* Sticky for desktop */}
            <NearbyServices suggestedSpecialty={suggestedSpecialty} />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
