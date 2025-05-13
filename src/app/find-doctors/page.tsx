
import React, { Suspense } from 'react';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import FindDoctors from '@/components/medi-seek/FindDoctors';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

function PageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <FindDoctors />
      </main>
      <AppFooter />
    </div>
  );
}

// A simple skeleton loader for the page content
function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Skeleton className="h-16 w-full" /> {/* Header placeholder */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-24 w-full" /> {/* Card header placeholder */}
          <Skeleton className="h-40 w-full" /> {/* Card content placeholder */}
          <Skeleton className="h-10 w-full" /> {/* Button placeholder */}
        </div>
      </main>
      <Skeleton className="h-20 w-full" /> {/* Footer placeholder */}
    </div>
  );
}


export default function FindDoctorsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
