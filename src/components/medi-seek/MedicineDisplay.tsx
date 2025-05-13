
import React from 'react';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { AlertTriangle, Pill, UserCheck, Beaker, FileQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MedicineDisplayProps {
  analysis: AnalyzeSymptomsOutput;
}

export default function MedicineDisplay({ analysis }: MedicineDisplayProps) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="bg-destructive/10 border-l-4 rtl:border-l-0 rtl:border-r-4 border-destructive text-destructive p-4 rounded-lg shadow-md" role="alert">
        <div className="flex items-start sm:items-center">
          <AlertTriangle className={cn("h-6 w-6 mt-1 sm:mt-0 shrink-0", language === 'ar' ? "ml-3" : "mr-3")} />
          <div>
            <h4 className="font-bold text-base sm:text-lg">{t('importantDisclaimerTitle')}</h4>
            <p className="text-sm">{analysis.disclaimer}</p>
          </div>
        </div>
      </div>

      {analysis.suggestedSpecialty && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg shadow-lg">
           <h3 className="text-xl font-bold text-primary-foreground mb-2 flex items-center">
            <UserCheck className={cn("h-6 w-6 text-primary", language === 'ar' ? "ml-2" : "mr-2")} />
            {t('suggestedMedicalSpecialtyTitle')}
          </h3>
          <p className="text-sm text-foreground">
            {t('suggestedMedicalSpecialtyInfo', { specialty: analysis.suggestedSpecialty })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('suggestedMedicalSpecialtyDisclaimer')}
          </p>
        </div>
      )}

      {analysis.suggestedMedicines && analysis.suggestedMedicines.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Pill className={cn("h-6 w-6 text-accent", language === 'ar' ? "ml-2" : "mr-2")} />
            {t('suggestedMedicinesTitle')}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t('suggestedMedicinesInfo')}
          </p>
          <ul className="space-y-4">
            {analysis.suggestedMedicines.map((medicine, index) => (
              <li key={index} className="p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 rtl:border-l-0 rtl:border-r-4 border-accent">
                <div className="flex items-center mb-1">
                  <Beaker className={cn("h-5 w-5 text-accent shrink-0", language === 'ar' ? "ml-3" : "mr-3")} />
                  <h5 className="font-semibold text-lg text-accent">{medicine.name}</h5>
                </div>
                <p className={cn("text-sm text-muted-foreground", language === 'ar' ? "mr-8" : "ml-8")}>
                  {t('suggestedDosageLabel')} 
                  <span className="text-foreground font-medium">{medicine.dosage}</span> 
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
         <div className="bg-primary/10 p-6 rounded-lg text-center border border-primary/30 shadow-md">
          <FileQuestion className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-lg font-semibold text-primary-foreground">{t('noMedicineSuggestionsTitle')}</p>
          <p className="text-sm text-foreground/80 mt-2">
            {t('noMedicineSuggestionsInfo')}
          </p>
        </div>
      )}
    </div>
  );
}
