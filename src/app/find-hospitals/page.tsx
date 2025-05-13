
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import FindHospitals from '@/components/medi-seek/FindHospitals';

export default function FindHospitalsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <FindHospitals />
      </main>
      <AppFooter />
    </div>
  );
}
