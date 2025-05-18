
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns'; // For formatting dates

// For dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found - MediSeek Blog',
    }
  }
  return {
    title: `${post.title} - MediSeek Blog`,
    description: post.excerpt || post.content.substring(0, 160),
  }
}

// For generating static paths if you choose to pre-render blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post: BlogPost | undefined = await getPostBySlug(params.slug);

  if (!post) {
    notFound(); // Triggers the not-found.tsx page or a default Next.js 404 page
  }

  // Split content by newlines to render paragraphs
  const contentParagraphs = post.content.split('\\n').filter(p => p.trim() !== '');

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-card p-6 sm:p-8">
            <Link href="/blogs" className="inline-flex items-center text-sm text-accent hover:underline mb-6 rtl:space-x-reverse">
              <ArrowLeft className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              Back to Blog
            </Link>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              {post.title}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground space-x-4 rtl:space-x-reverse mt-4">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <UserCircle className="h-4 w-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                <span>By {post.author}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 prose prose-sm sm:prose-base lg:prose-lg max-w-none text-foreground">
            {contentParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
