
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CalendarDays, UserCircle, Edit3, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleDeletePost, type DeletePostFormState } from '@/lib/actions';
import { useActionState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const initialDeleteState: DeletePostFormState = { message: '', timestamp: 0, success: false };

interface PostItemProps {
  post: BlogPost;
  onDeleteSuccess: (message: string) => void;
  onDeleteError: (message: string) => void;
}

function PostItem({ post, onDeleteSuccess, onDeleteError }: PostItemProps) {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(handleDeletePost, initialDeleteState);

  useEffect(() => {
    if (state.timestamp !== initialDeleteState.timestamp) { // Check if state has been updated
      if (state.success && state.message) {
        onDeleteSuccess(t(state.message));
      } else if (!state.success && state.message) {
        const errorMessage = state.errors?._form?.map(errKey => t(errKey)).join(', ') || t(state.message);
        onDeleteError(errorMessage);
      }
    }
  }, [state, t, onDeleteSuccess, onDeleteError]);

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground space-x-3 rtl:space-x-reverse mt-1">
          <div className="flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
            <span>{format(new Date(post.date), 'PP')}</span>
          </div>
          <div className="flex items-center">
            <UserCircle className="h-3.5 w-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
            <span>{post.author}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 text-sm">
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </CardDescription>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/edit-post/${post.slug}`}> {/* Placeholder: Edit page to be created */}
            <Edit3 className={cn("h-4 w-4", language === 'ar' ? "ml-1.5" : "mr-1.5")} /> {t('editButton')}
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={pending}>
              <Trash2 className={cn("h-4 w-4", language === 'ar' ? "ml-1.5" : "mr-1.5")} /> {pending ? t('deletingButton') : t('deleteButton')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteConfirmationTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteConfirmationMessage', { postTitle: post.title })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
              <form action={formAction}>
                <input type="hidden" name="postId" value={post.id} />
                <AlertDialogAction type="submit" disabled={pending}>
                  {pending ? t('deletingButton') : t('confirmDeleteButton')}
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default function ManageBlogsPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const fetchedPostsData = await getAllPosts();
        // Ensure that setPosts always receives an array
        setPosts(fetchedPostsData || []);
      } catch (error) {
        console.error("ManageBlogsPage: Error fetching posts in useEffect:", error);
        setPosts([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handlePostDeleted = (message: string) => {
    toast({
      title: t('successTitle'),
      description: message,
      variant: 'default', 
    });
    async function refetchPosts() {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts || []); // Also ensure an array here
    }
    refetchPosts();
  };
  
  const handleDeletionError = (message: string) => {
     toast({
      title: t('errorTitle'),
      description: message,
      variant: 'destructive',
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-lg rounded-xl">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Defensive check for posts - this should ideally not be triggered if useEffect is robust
  if (!Array.isArray(posts)) {
    // This console.error was the source of the reported error log
    console.error("ManageBlogsPage: 'posts' state is not an array after loading. Current value:", posts);
    return (
      <Card className="shadow-lg rounded-xl text-center p-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <CardTitle>{t('errorTitle')}</CardTitle>
        <CardDescription>{t('manageBlogsErrorLoading')}</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <Card className="shadow-lg rounded-xl text-center p-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>{t('noBlogPostsFoundTitle')}</CardTitle>
          <CardDescription>{t('noBlogPostsFoundAdminDescription')}</CardDescription>
          <Button asChild className="mt-4">
            <Link href="/admin/create-post">{t('createFirstPostButton')}</Link>
          </Button>
        </Card>
      ) : (
        posts.map((post) => (
          <PostItem 
            key={post.id} 
            post={post} 
            onDeleteSuccess={handlePostDeleted}
            onDeleteError={handleDeletionError}
          />
        ))
      )}
    </div>
  );
}
