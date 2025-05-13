
'use client';

import Link from 'next/link';
import { StethoscopeIcon, Search, Languages, Check } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage, availableLanguages, type LanguageCode } from '@/contexts/LanguageContext';

export default function AppHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const getMenuItemClass = (href: string) => {
    if (pathname === href) {
      return "bg-accent text-accent-foreground font-medium hover:bg-accent/90";
    }
    return "hover:bg-accent/10"; 
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <StethoscopeIcon className="h-8 w-8 text-accent mr-3" />
          <h1 className="text-3xl font-bold text-foreground">
            {t('headerTitlePart1')}<span className="text-accent">{t('headerTitlePart2')}</span>
          </h1>
        </Link>

        <div className="flex items-center space-x-2">
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-accent/30 focus:bg-accent/40">
                  <Search className="mr-2 h-4 w-4" /> {t('findServices')}
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild className={cn(getMenuItemClass("/find-pharmacies"))}>
                  <Link href="/find-pharmacies">{t('findPharmacies')}</Link>
                </MenubarItem>
                <MenubarItem asChild className={cn(getMenuItemClass("/find-doctors"))}>
                  <Link href="/find-doctors">{t('findDoctors')}</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild className={cn(getMenuItemClass("/find-pathology-labs"))}>
                  <Link href="/find-pathology-labs">{t('findPathologyLabs')}</Link>
                </MenubarItem>
                <MenubarItem asChild className={cn(getMenuItemClass("/find-hospitals"))}>
                  <Link href="/find-hospitals">{t('findHospitals')}</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-accent/30 focus:bg-accent/40">
                  <Languages className="mr-2 h-4 w-4" /> {availableLanguages[language]}
                </Button>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
                  {Object.entries(availableLanguages).map(([code, name]) => (
                    <MenubarRadioItem key={code} value={code} className="flex items-center justify-between hover:bg-accent/10">
                      <span>{name}</span>
                      {language === code && <Check className="h-4 w-4 text-accent" />}
                    </MenubarRadioItem>
                  ))}
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  );
}
