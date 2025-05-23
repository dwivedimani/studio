
'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { handleAddPost, type CreatePostFormState } from '@/lib/actions';
// AppHeader and AppFooter are removed as they are part of AdminLayout now
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FilePlus2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'; // LogOut removed
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
// import { useRouter } from 'next/navigation'; // No longer needed if redirect logic within this page is not re-added


const initialCreatePostState: CreatePostFormState = { message: '', timestamp: 0, success: false };

function SubmitPublishButton({ pending }: { pending: boolean }) {
  const { t, language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className={cn("animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> : <FilePlus2 className={cn(language === 'ar' ? 'ml-2' : 'mr-2')} />}
      {pending ? t('publishingButton') : t('publishButton')}
    </Button>
  );
}

export default function CreatePostPage() {
  const { t, language } = useLanguage();
  // const router = useRouter(); // No longer needed if redirect logic within this page is not re-added
  const [state, formAction, pending] = useActionState(handleAddPost, initialCreatePostState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.message === 'blogPostCreatedSuccess') {
      formRef.current?.reset();
      // router.push('/admin/dashboard'); // Optionally redirect after success - currently handled by staying on page
    }
  }, [state.success, state.message]); // Removed router from dependencies

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

  const titleErrors = state.errors?.title?.map(translateError).join(', ');
  const contentErrors = state.errors?.content?.map(translateError).join(', ');
  const authorErrors = state.errors?.author?.map(translateError).join(', ');
  const excerptErrors = state.errors?.excerpt?.map(translateError).join(', ');
  const formErrors = state.errors?._form?.map(translateError).join(', ');
  
  const generalMessageKey = state.message && !formErrors && state.message !== 'validationFailedMessage' ? state.message : '';
  const generalMessage = generalMessageKey ? t(generalMessageKey) : '';

  return (
    // The main div with flex flex-col min-h-screen is removed, AdminLayout handles it.
    // AppHeader and AppFooter are also removed.
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl">
      {/* CardHeader no longer needs justify-between or the logout form */}
      <CardHeader className="bg-card">
        <div className="flex items-center mb-2">
          <FilePlus2 className="h-8 w-8 text-accent mr-3 rtl:mr-0 rtl:ml-3" />
          <CardTitle className="text-2xl sm:text-3xl font-semibold">{t('createPostTitle')}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">{t('createPostDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form action={formAction} ref={formRef} className="space-y-6">
          <div>
            <Label htmlFor="title">{t('postTitleLabel')}</Label>
            <Input id="title" name="title" required className="mt-1" placeholder={t('postTitlePlaceholder')} />
            {titleErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{titleErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="content">{t('postContentLabel')}</Label>
            <Textarea id="content" name="content" rows={10} required className="mt-1" placeholder={t('postContentPlaceholder')} />
            {contentErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{contentErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="author">{t('postAuthorLabel')}</Label>
            <Input id="author" name="author" className="mt-1" placeholder={t('postAuthorPlaceholder')} />
            {authorErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{authorErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="excerpt">{t('postExcerptLabel')}</Label>
            <Textarea id="excerpt" name="excerpt" rows={3} className="mt-1" placeholder={t('postExcerptPlaceholder')} />
            {excerptErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{excerptErrors}</AlertDescription></Alert>}
          </div>

          {formErrors && (
            <Alert variant="destructive" className="mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('postCreationErrorTitle')}</AlertTitle>
              <AlertDescription>{formErrors}</AlertDescription>
            </Alert>
          )}
          {state.success && generalMessage && (
              <Alert variant="default" className="mt-1 bg-green-50 border-green-400 text-green-700">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>{t('successTitle')}</AlertTitle> 
              <AlertDescription>{generalMessage}</AlertDescription>
            </Alert>
          )}
            {!state.success && !formErrors && generalMessage && generalMessageKey !== 'blogPostCreatedSuccess' && (
              <Alert variant="destructive" className="mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('postCreationErrorTitle')}</AlertTitle>
              <AlertDescription>{generalMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className={cn("flex", language === 'ar' ? "justify-start" : "justify-end")}>
            <SubmitPublishButton pending={pending} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
