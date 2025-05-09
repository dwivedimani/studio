"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SymptomFormProps {
  formAction: (payload: FormData) => void;
  serverState: FormState; // Renamed from initialState to serverState for clarity
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
        </>
      ) : (
        'Analyze Symptoms'
      )}
    </Button>
  );
}

export default function SymptomForm({ formAction, serverState }: SymptomFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  // Effect to clear form on successful submission if desired, or use serverState.message to show success
  React.useEffect(() => {
    if (serverState.message === 'Symptoms analyzed successfully.' && serverState.analysis) {
      // formRef.current?.reset(); // Uncomment to clear form on success
    }
  }, [serverState]);

  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <div>
        <Label htmlFor="symptoms" className="block text-sm font-medium text-foreground mb-2">
          Describe your symptoms:
        </Label>
        <Textarea
          id="symptoms"
          name="symptoms"
          rows={6}
          className="w-full rounded-lg shadow-sm border-border focus:ring-accent focus:border-accent placeholder:text-muted-foreground/80"
          placeholder="e.g., I have a persistent cough, mild fever for two days, and body aches..."
          aria-describedby="symptoms-error"
          required
          defaultValue={formRef.current?.symptoms?.value || ''} // Retain value on validation error if not using controlled component
        />
        {serverState.errors?.symptoms && (
          <Alert variant="destructive" className="mt-2 rounded-md" id="symptoms-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {serverState.errors.symptoms.join(', ')}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
