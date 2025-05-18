
'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleAdminLogin, type AdminLoginFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import AppHeader from '@/components/medi-seek/AppHeader'; // Optional: for consistent layout
import AppFooter from '@/components/medi-seek/AppFooter'; // Optional: for consistent layout

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

export default function AdminLoginPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(handleAdminLogin, initialLoginState);

  useEffect(() => {
    if (state.message === 'adminLoginSuccess') {
      // Redirect to a protected admin page, e.g., create post or dashboard
      router.push('/admin/create-post'); 
    }
  }, [state.message, router]);

  const translateError = (errorMsgKey: string): string => {
    return t(errorMsgKey); // Assuming error messages from action are already keys
  };
  
  const usernameErrors = state.errors?.username?.map(translateError).join(', ');
  const passwordErrors = state.errors?.password?.map(translateError).join(', ');
  const formErrors = state.errors?._form?.map(translateError).join(', ');

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
              <div>
                <Label htmlFor="username">{t('usernameLabel')}</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1"
                  placeholder={t('usernamePlaceholder')}
                />
                {usernameErrors && (
                  <Alert variant="destructive" className="mt-2 text-xs">
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
                />
                {passwordErrors && (
                   <Alert variant="destructive" className="mt-2 text-xs">
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
              <SubmitButton pending={pending} />
            </form>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
