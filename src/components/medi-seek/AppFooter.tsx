
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function AppFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card shadow-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t('footerCopyright', { year: currentYear })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('footerDisclaimer')}
        </p>
      </div>
    </footer>
  );
}
