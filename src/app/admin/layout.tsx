
'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, FilePlus2, Settings2, LogOut, StethoscopeIcon } from 'lucide-react'; // Ensured Settings2 is here, removed Newspaper if it was conflicting
import { handleAdminLogout } from '@/lib/actions';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return t('dashboardTitle');
    if (pathname === '/admin/create-post') return t('createPostTitle');
    if (pathname === '/admin/manage-blogs') return t('manageBlogsTitle');
    return t('adminPanel'); // Default title
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar collapsible="icon" className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <StethoscopeIcon className="h-7 w-7 text-accent" />
              <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                {t('headerTitlePart1')}
                <span className="text-accent">{t('headerTitlePart2')}</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/dashboard')}
                  tooltip={{ children: t('dashboardTitle'), side: language === 'ar' ? 'left' : 'right' }}
                  className="justify-start"
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard />
                    <span className="group-data-[collapsible=icon]:hidden">{t('dashboardTitle')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/create-post')}
                  tooltip={{ children: t('createPostTitle'), side: language === 'ar' ? 'left' : 'right' }}
                  className="justify-start"
                >
                  <Link href="/admin/create-post">
                    <FilePlus2 />
                    <span className="group-data-[collapsible=icon]:hidden">{t('createPostTitle')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/manage-blogs')}
                  tooltip={{ children: t('manageBlogsTitle'), side: language === 'ar' ? 'left' : 'right' }}
                  className="justify-start"
                >
                  <Link href="/admin/manage-blogs">
                    <Settings2 /> {/* Using Settings2 icon */}
                    <span className="group-data-[collapsible=icon]:hidden">{t('manageBlogsTitle')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto border-t border-border">
            <form action={handleAdminLogout} className="w-full">
              <SidebarMenuButton
                type="submit"
                className="w-full justify-start"
                tooltip={{ children: t('logoutButton'), side: language === 'ar' ? 'left' : 'right' }}
                variant="ghost"
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">{t('logoutButton')}</span>
              </SidebarMenuButton>
            </form>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 bg-secondary/30">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
             <SidebarTrigger className="md:hidden" />
             <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">
                    {getPageTitle()}
                </h1>
             </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
