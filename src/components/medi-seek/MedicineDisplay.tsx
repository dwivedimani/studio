
import React from 'react';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { AlertTriangle, Pill, UserCheck, Beaker, FileQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MedicineDisplayProps {
  analysis: AnalyzeSymptomsOutput;
}

export default function MedicineDisplay({ analysis }: MedicineDisplayProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg shadow-md" role="alert">
        <div className="flex items-start sm:items-center">
          <AlertTriangle className="h-6 w-6 mr-3 mt-1 sm:mt-0 shrink-0" />
          <div>
            <h4 className="font-bold text-base sm:text-lg">{t('importantDisclaimerTitle')}</h4>
            {/* Disclaimer from AI is already translated by AI */}
            <p className="text-sm">{analysis.disclaimer}</p>
          </div>
        </div>
      </div>

      {analysis.suggestedSpecialty && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg shadow-lg">
           <h3 className="text-xl font-bold text-primary-foreground mb-2 flex items-center">
            <UserCheck className="h-6 w-6 mr-2 text-primary" />
            {t('suggestedMedicalSpecialtyTitle')}
          </h3>
          {/* Specialty name from AI is already translated by AI */}
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
            <Pill className="h-6 w-6 mr-2 text-accent" />
            {t('suggestedMedicinesTitle')}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t('suggestedMedicinesInfo')}
          </p>
          <ul className="space-y-4">
            {analysis.suggestedMedicines.map((medicine, index) => (
              <li key={index} className="p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-accent">
                <div className="flex items-center mb-1">
                  <Beaker className="h-5 w-5 mr-3 text-accent shrink-0" />
                  {/* Medicine name from AI is already translated by AI */}
                  <h5 className="font-semibold text-lg text-accent">{medicine.name}</h5>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {t('suggestedDosageLabel')} {/* Dosage from AI is already translated by AI */}
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

