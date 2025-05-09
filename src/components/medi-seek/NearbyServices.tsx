"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Stethoscope, ExternalLink } from 'lucide-react';

export default function NearbyServices() {
  const openGoogleMapsPharmacies = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=pharmacies+near+me', '_blank', 'noopener,noreferrer');
  };

  const openGoogleSearchDoctors = () => {
    window.open('https://www.google.com/search?q=doctors+near+me', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/20">
        <CardTitle className="text-2xl text-primary-foreground flex items-center">
          <MapPin className="mr-3 h-7 w-7" />
          Find Local Health Services
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Quick links to find pharmacies and doctors near you via Google. These links will open in a new tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <Button
          onClick={openGoogleMapsPharmacies}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-primary-foreground/50 focus:ring-offset-2 focus:ring-offset-card"
          variant="default"
          size="lg"
        >
          <MapPin className="mr-2 h-5 w-5" />
          Find Nearby Pharmacies
          <ExternalLink className="ml-auto h-4 w-4 text-primary-foreground/70" />
        </Button>
        <Button
          onClick={openGoogleSearchDoctors}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-primary-foreground/50 focus:ring-offset-2 focus:ring-offset-card"
          variant="default"
          size="lg"
        >
          <Stethoscope className="mr-2 h-5 w-5" />
          Search for Doctors
           <ExternalLink className="ml-auto h-4 w-4 text-primary-foreground/70" />
        </Button>
        <p className="text-xs text-muted-foreground pt-2">
          Please note: These links use Google services. For precise results, ensure your device's location services are enabled and permissions are granted to your browser or Google Maps.
        </p>
      </CardContent>
    </Card>
  );
}
