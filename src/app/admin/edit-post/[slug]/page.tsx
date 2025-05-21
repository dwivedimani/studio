
'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import { getPostBySlug, type NewBlogPost } from '@/lib/blog'; // getPostBySlug is fine for initial load
import { handleUpdatePost, type UpdatePostFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Edit3, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';


const initialUpdatePostState: UpdatePostFormState = { message: '', timestamp: 0, success: false };

function SubmitUpdateButton({ pending }: { pending: boolean }) {
  const { t, language } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className={cn("animate-spin", language === 'ar' ? 'ml-2' : 'mr-2')} /> : <Edit3 className={cn(language === 'ar' ? 'ml-2' : 'mr-2')} />}
      {pending ? t('updatingButton') : t('updatePostButton')}
    </Button>
  );
}

export default function EditPostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [state, formAction, pending] = useActionState(handleUpdatePost, initialUpdatePostState);
  const formRef = useRef<HTMLFormElement>(null);
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getPostBySlug(slug)
        .then(fetchedPost => {
          if (fetchedPost) {
            setPost(fetchedPost);
            // Set initial values for the form if needed, or rely on defaultValue/value attributes
          } else {
            setNotFound(true);
          }
        })
        .catch(err => {
          console.error("Failed to fetch post for editing:", err);
          setNotFound(true); // Or handle error differently
        })
        .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
        setNotFound(true); // No slug, no post
    }
  }, [slug]);

  useEffect(() => {
    if (state.success && state.message === 'blogPostUpdatedSuccess') {
        // Optionally, redirect to the new slug if it changed
        if (state.updatedSlug && state.updatedSlug !== slug) {
            router.push(`/admin/edit-post/${state.updatedSlug}`);
        }
        // Or redirect to manage page
        // router.push('/admin/manage-blogs');
    }
  }, [state.success, state.message, state.updatedSlug, slug, router]);

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

  if (isLoading) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    );
  }

  if (notFound) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl rounded-xl text-center p-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <CardTitle>{t('postNotFoundTitle')}</CardTitle>
        <CardDescription>{t('postNotFoundMessage', { slug: slug })}</CardDescription>
        <Button asChild className="mt-6">
          <Link href="/admin/manage-blogs">
            <ArrowLeft className={cn("h-4 w-4", language === 'ar' ? 'ml-2' : 'mr-2')} />
            {t('backToManageBlogsButton')}
          </Link>
        </Button>
      </Card>
    );
  }
  
  if (!post) return null; // Should be covered by notFound, but as a safeguard

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl">
      <CardHeader className="bg-card">
        <div className="flex items-center mb-2">
          <Edit3 className="h-8 w-8 text-accent mr-3 rtl:mr-0 rtl:ml-3" />
          <CardTitle className="text-2xl sm:text-3xl font-semibold">{t('editPostTitlePage')}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">{t('editPostDescription', { postTitle: post.title })}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form action={formAction} ref={formRef} className="space-y-6">
          <input type="hidden" name="postId" value={post.id} />
          <div>
            <Label htmlFor="title">{t('postTitleLabel')}</Label>
            <Input id="title" name="title" required className="mt-1" placeholder={t('postTitlePlaceholder')} defaultValue={post.title} />
            {titleErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{titleErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="content">{t('postContentLabel')}</Label>
            <Textarea id="content" name="content" rows={10} required className="mt-1" placeholder={t('postContentPlaceholder')} defaultValue={post.content} />
            {contentErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{contentErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="author">{t('postAuthorLabel')}</Label>
            <Input id="author" name="author" className="mt-1" placeholder={t('postAuthorPlaceholder')} defaultValue={post.author} />
            {authorErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{authorErrors}</AlertDescription></Alert>}
          </div>
          <div>
            <Label htmlFor="excerpt">{t('postExcerptLabel')}</Label>
            <Textarea id="excerpt" name="excerpt" rows={3} className="mt-1" placeholder={t('postExcerptPlaceholder')} defaultValue={post.excerpt} />
            {excerptErrors && <Alert variant="destructive" className="mt-2 text-xs"><AlertCircle className="h-3 w-3" /><AlertDescription>{excerptErrors}</AlertDescription></Alert>}
          </div>

          {formErrors && (
            <Alert variant="destructive" className="mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('postUpdateErrorTitle')}</AlertTitle>
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
          {!state.success && !formErrors && generalMessage && generalMessageKey !== 'blogPostUpdatedSuccess' && (
              <Alert variant="destructive" className="mt-1">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('postUpdateErrorTitle')}</AlertTitle>
              <AlertDescription>{generalMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className={cn("flex items-center", language === 'ar' ? "justify-between flex-row-reverse" : "justify-between")}>
            <Button variant="outline" asChild>
                <Link href="/admin/manage-blogs">
                    <ArrowLeft className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                    {t('backToManageBlogsButton')}
                </Link>
            </Button>
            <SubmitUpdateButton pending={pending} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

