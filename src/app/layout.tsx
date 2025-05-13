
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';

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
  return (
    // The lang attribute will be set dynamically by LanguageProvider
    <html> 
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-ai-hint="modern medical" // For background image suggestion
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

