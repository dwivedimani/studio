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

const initialHospitalsState: FindHospitalsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : 'Search Hospitals'}
    </Button>
  );
}

export default function FindHospitals() {
  const [state, formAction, pending] = useActionState(handleFindHospitals, initialHospitalsState);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.data || state.errors) {
      // formRef.current?.reset(); // Optionally reset form
    }
  }, [state.timestamp]);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
        {/* Placeholder for half star if needed in future */}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />)}
         <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    );
  };


  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <HospitalIcon className="mr-3 h-6 w-6 sm:h-7 sm:w-7" /> 
          Find Hospitals
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter a location for AI-generated examples of hospitals. For demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="hospital-location" className="text-sm font-medium">Location (e.g., City, Zip Code)</Label>
            <Input
              id="hospital-location"
              name="location"
              placeholder="e.g., Gotham City, 98765"
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
            <AlertTitle className="font-semibold text-accent-foreground">AI-Generated Data</AlertTitle>
            <AlertDescription className="text-xs">
              {state.data.disclaimer} Searched for: <span className="font-medium">{state.data.searchedLocation}</span>
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">Generated Hospital Results:</h4>
          {state.data.hospitals.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.hospitals.map((hospital, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-primary-foreground flex items-center"><Building className="w-4 h-4 mr-2 text-primary/80"/>{hospital.name}</p>
                    {hospital.rating && renderStars(hospital.rating)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{hospital.address}</p>
                  {hospital.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {hospital.phone}</p>}
                  {hospital.emergencyServices !== undefined && (
                    <p className={`text-xs flex items-center mt-1 ${hospital.emergencyServices ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      <HeartPulse className="w-3 h-3 mr-1.5"/> Emergency Services: {hospital.emergencyServices ? 'Available' : 'Not Specified/Unavailable'}
                    </p>
                  )}
                  {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-foreground">Key Specialties:</p>
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
            <p className="text-sm text-muted-foreground">No hospital data generated for this location.</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

