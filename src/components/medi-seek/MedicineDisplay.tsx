import React from 'react';
import type { AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
import { AlertTriangle, Pill, Info } from 'lucide-react';

interface MedicineDisplayProps {
  analysis: AnalyzeSymptomsOutput;
}

export default function MedicineDisplay({ analysis }: MedicineDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-lg shadow" role="alert">
        <div className="flex items-start sm:items-center">
          <AlertTriangle className="h-6 w-6 mr-3 mt-1 sm:mt-0 shrink-0" />
          <div>
            <h4 className="font-bold text-base sm:text-lg">Important Disclaimer</h4>
            <p className="text-sm">{analysis.disclaimer}</p>
          </div>
        </div>
      </div>

      {analysis.suggestedMedicines && analysis.suggestedMedicines.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
            <Pill className="h-5 w-5 mr-2 text-accent" />
            Suggested Over-the-Counter Medicines
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            The following are generic suggestions based on the symptoms you provided. This is not a diagnosis or medical advice. Always consult with a healthcare professional or pharmacist before taking any new medication, read product labels carefully, and follow recommended dosages. If your symptoms persist or worsen, seek medical attention.
          </p>
          <ul className="space-y-3">
            {analysis.suggestedMedicines.map((medicine, index) => (
              <li key={index} className="p-4 bg-card border border-border rounded-lg shadow-sm text-foreground hover:shadow-md transition-shadow">
                <p className="font-semibold text-primary-foreground">{medicine.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Suggested Dosage: <span className="text-foreground">{medicine.dosage}</span></p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
         <div className="bg-muted/30 p-6 rounded-lg text-center border border-dashed border-muted-foreground/50">
          <Info className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No Specific Medicine Suggestions</p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on the symptoms provided, no specific over-the-counter medicine suggestions could be generated, or the AI determined it was inappropriate to suggest any. This could be due to the nature of the symptoms or limitations of the analysis. We strongly recommend consulting a healthcare professional for guidance.
          </p>
        </div>
      )}
    </div>
  );
}
