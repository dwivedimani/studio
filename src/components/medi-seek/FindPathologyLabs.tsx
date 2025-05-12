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

const initialPathologyLabsState: FindPathologyLabsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : 'Search Labs'}
    </Button>
  );
}

export default function FindPathologyLabs() {
  const [state, formAction, pending] = useActionState(handleFindPathologyLabs, initialPathologyLabsState);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.data || state.errors) {
      // formRef.current?.reset(); // Optionally reset form on new data/error
    }
  }, [state.timestamp]);

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <TestTube2 className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
          Find Pathology Labs (Illustrative)
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter a location for AI-generated examples of pathology labs. For demonstration only.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="pathology-location" className="text-sm font-medium">Location (e.g., City, Zip Code)</Label>
            <Input
              id="pathology-location"
              name="location"
              placeholder="e.g., Metropolis, 54321"
              className="mt-1"
              required
            />
            {state.errors?.location && (
              <Alert variant="destructive" className="mt-2 text-xs">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{state.errors.location.join(', ')}</AlertDescription>
              </Alert>
            )}
          </div>
          <SubmitButton pending={pending} />
        </form>

        {state.errors?._form && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Search Error</AlertTitle>
            <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      {state.data && (
        <CardFooter className="flex-col items-start p-4 sm:p-6 border-t bg-card">
          <Alert variant="default" className="mb-4 bg-accent/10 border-accent text-accent-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold text-accent-foreground">Illustrative Data</AlertTitle>
            <AlertDescription className="text-xs">
              {state.data.disclaimer} Searched for: <span className="font-medium">{state.data.searchedLocation}</span>
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">Generated Lab Results:</h4>
          {state.data.labs.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.labs.map((lab, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <p className="font-semibold text-primary-foreground flex items-center"><Building className="w-4 h-4 mr-2 text-primary/80"/>{lab.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lab.address}</p>
                  {lab.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {lab.phone}</p>}
                  {lab.operatingHours && <p className="text-xs text-muted-foreground flex items-center mt-1"><Clock className="w-3 h-3 mr-1.5 text-primary/70"/> {lab.operatingHours}</p>}
                  {lab.servicesOffered && lab.servicesOffered.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-foreground flex items-center"><FlaskConical className="w-3 h-3 mr-1.5 text-primary/70"/> Services Offered:</p>
                      <ul className="list-disc list-inside pl-1">
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
            <p className="text-sm text-muted-foreground">No illustrative pathology lab data generated for this location.</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
