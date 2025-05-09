"use client";

import React, { useActionState, useRef, useState, useEffect } from 'react';
import type { FindPharmaciesFormState, FindDoctorsFormState } from '@/lib/actions';
import { handleFindPharmacies, handleFindDoctors } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Stethoscope, Search, Loader2, AlertTriangle, Phone, Clock, Building, AlertCircle } from 'lucide-react'; // Added AlertCircle

const initialPharmaciesState: FindPharmaciesFormState = { message: '', timestamp: 0 };
const initialDoctorsState: FindDoctorsFormState = { message: '', timestamp: 0 };

interface NearbyServicesProps {
  suggestedSpecialty?: string;
}

function SubmitButton({ pending, text }: { pending: boolean, text: string }) {
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : text}
    </Button>
  );
}

export default function NearbyServices({ suggestedSpecialty }: NearbyServicesProps) {
  const [pharmaciesState, pharmaciesFormAction, pharmacyPending] = useActionState(handleFindPharmacies, initialPharmaciesState);
  const [doctorsState, doctorsFormAction, doctorPending] = useActionState(handleFindDoctors, initialDoctorsState);

  const pharmacyFormRef = useRef<HTMLFormElement>(null);
  const doctorFormRef = useRef<HTMLFormElement>(null);

  const [doctorSpecialtyValue, setDoctorSpecialtyValue] = useState('');

  useEffect(() => {
    if (suggestedSpecialty) {
      setDoctorSpecialtyValue(suggestedSpecialty);
    }
    // If suggestedSpecialty becomes undefined (e.g. after a new symptom analysis without a specialty),
    // we might want to clear it or let the user manage the field.
    // For now, it only sets if a new specialty is suggested.
  }, [suggestedSpecialty]);
  
  React.useEffect(() => {
    if (pharmaciesState.data || pharmaciesState.errors) { // Reset on data or error to clear previous results
        pharmacyFormRef.current?.reset();
    }
  }, [pharmaciesState.timestamp]); // Use timestamp to detect new submission

  React.useEffect(() => {
    if (doctorsState.data || doctorsState.errors) { // Reset on data or error
        // doctorFormRef.current?.reset(); // This would clear the pre-filled specialty too early
        // Instead, clear only location if needed, or rely on user to clear.
        // For now, let's not reset the doctor form fields automatically to preserve pre-fill.
        // If a successful search happens and new data is available, the specialty might have been used.
        if (doctorsState.data) {
          // Potentially clear location:
          // if (doctorFormRef.current) {
          //  (doctorFormRef.current.elements.namedItem('location') as HTMLInputElement).value = '';
          // }
        }
    }
  }, [doctorsState.timestamp]); // Use timestamp


  return (
    <div className="space-y-8">
      {/* Find Pharmacies Card */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/20">
          <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
            <MapPin className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
            Find Nearby Pharmacies (Illustrative)
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
            Enter a location to get AI-generated examples of pharmacies. This is for demonstration only.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form action={pharmaciesFormAction} ref={pharmacyFormRef} className="space-y-4">
            <div>
              <Label htmlFor="pharmacy-location" className="text-sm font-medium">Location (e.g., City, Zip Code)</Label>
              <Input
                id="pharmacy-location"
                name="location"
                placeholder="e.g., Springfield, 12345"
                className="mt-1"
                required
              />
              {pharmaciesState.errors?.location && (
                <Alert variant="destructive" className="mt-2 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription>{pharmaciesState.errors.location.join(', ')}</AlertDescription>
                </Alert>
              )}
            </div>
            <SubmitButton pending={pharmacyPending} text="Search Pharmacies" />
          </form>

          {pharmaciesState.errors?._form && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Search Error</AlertTitle>
              <AlertDescription>{pharmaciesState.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        {pharmaciesState.data && (
          <CardFooter className="flex-col items-start p-4 sm:p-6 border-t bg-card">
            <Alert variant="default" className="mb-4 bg-accent/10 border-accent text-accent-foreground">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent-foreground">Illustrative Data</AlertTitle>
              <AlertDescription className="text-xs">
                {pharmaciesState.data.disclaimer} Searched for: <span className="font-medium">{pharmaciesState.data.searchedLocation}</span>
              </AlertDescription>
            </Alert>
            <h4 className="text-lg font-semibold mb-2 text-foreground">Generated Pharmacy Results:</h4>
            {pharmaciesState.data.pharmacies.length > 0 ? (
              <ul className="space-y-3 w-full">
                {pharmaciesState.data.pharmacies.map((pharmacy, index) => (
                  <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                    <p className="font-semibold text-primary-foreground flex items-center"><Building className="w-4 h-4 mr-2 text-primary/80"/>{pharmacy.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pharmacy.address}</p>
                    {pharmacy.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {pharmacy.phone}</p>}
                    {pharmacy.hours && <p className="text-xs text-muted-foreground flex items-center mt-1"><Clock className="w-3 h-3 mr-1.5 text-primary/70"/> {pharmacy.hours}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No illustrative pharmacy data generated for this location.</p>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Find Doctors Card */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/20">
          <CardTitle className="text-xl sm:text-2xl text-primary-foreground flex items-center">
            <Stethoscope className="mr-3 h-6 w-6 sm:h-7 sm:w-7" />
            Find Doctors (Illustrative)
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-xs sm:text-sm">
            Enter location &amp; optionally specialty. Specialty may be pre-filled based on symptom analysis. For demonstration only.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form action={doctorsFormAction} ref={doctorFormRef} className="space-y-4">
            <div>
              <Label htmlFor="doctor-location" className="text-sm font-medium">Location (e.g., City, Zip Code)</Label>
              <Input
                id="doctor-location"
                name="location"
                placeholder="e.g., Shelbyville, 67890"
                className="mt-1"
                required
              />
              {doctorsState.errors?.location && (
                 <Alert variant="destructive" className="mt-2 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription>{doctorsState.errors.location.join(', ')}</AlertDescription>
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
               {doctorsState.errors?.specialty && (
                 <Alert variant="destructive" className="mt-2 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription>{doctorsState.errors.specialty.join(', ')}</AlertDescription>
                </Alert>
              )}
            </div>
            <SubmitButton pending={doctorPending} text="Search Doctors" />
          </form>

          {doctorsState.errors?._form && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Search Error</AlertTitle>
              <AlertDescription>{doctorsState.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        {doctorsState.data && (
          <CardFooter className="flex-col items-start p-4 sm:p-6 border-t bg-card">
             <Alert variant="default" className="mb-4 bg-accent/10 border-accent text-accent-foreground">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent-foreground">Illustrative Data</AlertTitle>
              <AlertDescription className="text-xs">
                {doctorsState.data.disclaimer} Searched for: <span className="font-medium">{doctorsState.data.searchedLocation}</span>
                {doctorsState.data.searchedSpecialty && <>, Specialty: <span className="font-medium">{doctorsState.data.searchedSpecialty}</span></>}
              </AlertDescription>
            </Alert>
            <h4 className="text-lg font-semibold mb-2 text-foreground">Generated Doctor Results:</h4>
            {doctorsState.data.doctors.length > 0 ? (
              <ul className="space-y-3 w-full">
                {doctorsState.data.doctors.map((doctor, index) => (
                  <li key={index} className="p-3 border rounded-md bg-background shadow-sm">
                    <p className="font-semibold text-primary-foreground flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-primary/80"/>{doctor.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Specialty: {doctor.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doctor.address}</p>
                    {doctor.phone && <p className="text-xs text-muted-foreground flex items-center mt-1"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/> {doctor.phone}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No illustrative doctor data generated for this location/specialty.</p>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
