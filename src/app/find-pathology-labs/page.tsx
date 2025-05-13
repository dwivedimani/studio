
import React, { Suspense } from 'react';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import FindPathologyLabs from '@/components/medi-seek/FindPathologyLabs';
import { Skeleton } from '@/components/ui/skeleton';

function PageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <FindPathologyLabs />
      </main>
      <AppFooter />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Skeleton className="h-16 w-full" />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export default function FindPathologyLabsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
