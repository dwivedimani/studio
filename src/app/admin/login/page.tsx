
'use client';

import React, { useActionState, Suspense } from 'react'; 
import { handleAdminLogin, type AdminLoginFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import AppHeader from '@/components/medi-seek/AppHeader'; 
import AppFooter from '@/components/medi-seek/AppFooter'; 
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const initialLoginState: AdminLoginFormState = { message: '', timestamp: 0 };

function SubmitButton({ pending }: { pending: boolean }) {
  const { t, language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className={cn("animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> : <LogIn className={cn(language === 'ar' ? 'ml-2' : 'mr-2')} />}
      {pending ? t('loggingInButton') : t('loginButton')}
    </Button>
  );
}

function AdminLoginContent() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleAdminLogin, initialLoginState);
  const searchParams = useSearchParams(); 
  const redirectTo = searchParams.get('redirectTo'); 

  const translateError = (errorMsgKey: string): string => {
    if (errorMsgKey.includes('|')) {
      const parts = errorMsgKey.split('|');
      const errorKey = parts[0];
      try {
        const params = parts[1] ? JSON.parse(parts[1]) : undefined;
        return t(errorKey, params);
      } catch (e) { return t(errorKey); }
    }
    return t(errorMsgKey);
  };
  
  const usernameErrors = state.errors?.username?.map(translateError).join(', ');
  const passwordErrors = state.errors?.password?.map(translateError).join(', ');
  const formErrors = state.errors?._form?.map(translateError).join(', ');
  const generalMessage = state.message && !formErrors && state.message !== 'validationFailedMessage' && state.message !== 'adminLoginSuccess' ? t(state.message) : '';

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <CardHeader className="text-center bg-card">
            <LogIn className="h-12 w-12 text-accent mx-auto mb-3" />
            <CardTitle className="text-2xl sm:text-3xl font-semibold">{t('adminLoginTitle')}</CardTitle>
            <CardDescription className="text-muted-foreground">{t('adminLoginDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form action={formAction} className="space-y-6">
              {redirectTo && (
                <input type="hidden" name="redirectTo" value={redirectTo} />
              )}
              <div>
                <Label htmlFor="username">{t('usernameLabel')}</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1"
                  placeholder={t('usernamePlaceholder')}
                  aria-describedby={usernameErrors ? "username-error" : undefined}
                />
                {usernameErrors && (
                  <Alert variant="destructive" className="mt-2 text-xs" id="username-error">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription>{usernameErrors}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="password">{t('passwordLabel')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1"
                  placeholder={t('passwordPlaceholder')}
                  aria-describedby={passwordErrors ? "password-error" : undefined}
                />
                {passwordErrors && (
                   <Alert variant="destructive" className="mt-2 text-xs" id="password-error">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription>{passwordErrors}</AlertDescription>
                  </Alert>
                )}
              </div>
              
              {formErrors && (
                <Alert variant="destructive" className="mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('loginFailedErrorTitle')}</AlertTitle>
                  <AlertDescription>{formErrors}</AlertDescription>
                </Alert>
              )}
              {generalMessage && !formErrors && ( 
                 <Alert variant="destructive" className="mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('loginFailedErrorTitle')}</AlertTitle>
                  <AlertDescription>{generalMessage}</AlertDescription>
                </Alert>
              )}
              <SubmitButton pending={pending} />
            </form>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}

function AdminLoginLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Skeleton className="h-16 w-full" /> {/* Header placeholder */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-card shadow-xl rounded-xl p-6 text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mx-auto" />
          </div>
          <div className="bg-card shadow-xl rounded-xl p-6 space-y-6">
            <div>
              <Skeleton className="h-4 w-1/4 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
      <Skeleton className="h-20 w-full" /> {/* Footer placeholder */}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginLoadingSkeleton />}>
      <AdminLoginContent />
    </Suspense>
  );
}
