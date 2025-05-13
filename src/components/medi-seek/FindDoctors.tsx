
"use client";

import React, { useActionState, useRef, useState } from 'react';
import type { FindDoctorsFormState } from '@/lib/actions';
import { handleFindDoctors } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, Search, Loader2, AlertTriangle, Phone, Building, AlertCircle } from 'lucide-react'; 

const initialDoctorsState: FindDoctorsFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : 'Search Doctors'}
    </Button>
  );
}

export default function FindDoctors() {
  const [state, formAction, pending] = useActionState(handleFindDoctors, initialDoctorsState);
  const formRef = useRef<HTMLFormElement>(null);
  const [doctorSpecialtyValue, setDoctorSpecialtyValue] = useState(''); // Specialty is now managed locally

  React.useEffect(() => {
    // Optional: Reset form or perform actions on new state.timestamp
  }, [state.timestamp]);

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
          <Stethoscope className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
          Find Doctors
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
          Enter location &amp; optionally specialty. For demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="doctor-location" className="text-sm font-medium">Location (e.g., City, Zip Code)</Label>
            <Input
              id="doctor-location"
              name="location"
              placeholder="e.g., Shelbyville, 67890"
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
          <div>
            <Label htmlFor="doctor-specialty" className="text-sm font-medium">Specialty (Optional)</Label>
            <Input
              id="doctor-specialty"
              name="specialty"
              placeholder="e.g., Pediatrician, Cardiologist"
              className="mt-1"
              value={doctorSpecialtyValue}
              onChange={(e) => setDoctorSpecialtyValue(e.target.value)}
            />
             {state.errors?.specialty && (
               <Alert variant="destructive" className="mt-2 text-xs">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription>{state.errors.specialty.join(', ')}</AlertDescription>
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
           <Alert variant="default" className="mb-4 bg-accent/20 border-accent text-accent-foreground"> {/* Changed bg-accent/10 to bg-accent/20 */}
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold text-accent-foreground">AI-Generated Data</AlertTitle>
            <AlertDescription className="text-xs">
              {state.data.disclaimer} Searched for: <span className="font-medium">{state.data.searchedLocation}</span>
              {state.data.searchedSpecialty && <>, Specialty: <span className="font-medium">{state.data.searchedSpecialty}</span></>}
            </AlertDescription>
          </Alert>
          <h4 className="text-lg font-semibold mb-2 text-foreground">Generated Doctor Results:</h4>
          {state.data.doctors.length > 0 ? (
            <ul className="space-y-3 w-full">
              {state.data.doctors.map((doctor, index) => (
                <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <p className="font-semibold text-primary-foreground flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-primary/80"/>{doctor.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Specialty: {doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doctor.address}</p>
                  {doctor.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {doctor.phone}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No doctor data generated for this location/specialty.</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
