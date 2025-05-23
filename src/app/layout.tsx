
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MediSeek - AI Symptom Analyzer',
  description: 'Get informational suggestions for over-the-counter medicines based on your symptoms and find nearby health services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    // The lang attribute will be set dynamically by LanguageProvider
    <html> 
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-ai-hint="medical technology" 
      >
        <LanguageProvider>
          {process.env.NODE_ENV === 'production' && gaMeasurementId && (
            <Suspense fallback={null}> {/* Wrap GoogleAnalytics in Suspense */}
              <GoogleAnalytics measurementId={gaMeasurementId} />
            </Suspense>
          )}
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
