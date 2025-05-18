
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import AppHeader from '@/components/medi-seek/AppHeader';
import AppFooter from '@/components/medi-seek/AppFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext'; // Added for potential future use

export const metadata = {
  title: 'MediSeek Blog - Health Insights and News', // Consider making this dynamic with translations
  description: 'Read the latest articles, insights, and news on health, wellness, and medical topics from MediSeek.',
};

export default async function BlogListPage() {
  // const { t } = useLanguage(); // If needed for translated static text
  const posts: BlogPost[] = await getAllPosts();

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Newspaper className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">MediSeek Blog</h1>
          <p className="text-lg text-muted-foreground">
            Your source for health insights, tips, and news.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl font-semibold hover:text-accent transition-colors">
                    <Link href={`/blogs/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4 rtl:space-x-reverse mt-2">
                    <div className="flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <UserCircle className="h-3.5 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-sm text-foreground/80 mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')}
                  </CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className="px-0 text-accent hover:text-accent/80">
                    <Link href={`/blogs/${post.slug}`}>
                      Read More &rarr;
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
