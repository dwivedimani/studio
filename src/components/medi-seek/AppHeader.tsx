'use client';

import Link from 'next/link';
import { StethoscopeIcon, Search } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const pathname = usePathname();

  const getMenuItemClass = (href: string) => {
    if (pathname === href) {
      // Stronger highlight for active item, with a subtle hover effect.
      // The text color will be `text-accent-foreground`.
      // The background will be `bg-accent`.
      // On hover, the background will be `bg-accent/90` (accent color with 90% opacity).
      return "bg-accent text-accent-foreground font-medium hover:bg-accent/90";
    }
    // For non-active items, rely on default MenubarItem styles for hover/focus.
    // MenubarItem's default focused style is `focus:bg-accent focus:text-accent-foreground`.
    return ""; 
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <StethoscopeIcon className="h-8 w-8 text-accent mr-3" />
          <h1 className="text-3xl font-bold text-foreground">
            Medi<span className="text-accent">Seek</span>
          </h1>
        </Link>

        <Menubar className="border-none bg-transparent">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button variant="ghost" className="text-foreground">
                <Search className="mr-2 h-4 w-4" /> Find Services
              </Button>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild className={cn(getMenuItemClass("/find-pharmacies"))}>
                <Link href="/find-pharmacies">Find Pharmacies</Link>
              </MenubarItem>
              <MenubarItem asChild className={cn(getMenuItemClass("/find-doctors"))}>
                <Link href="/find-doctors">Find Doctors</Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem asChild className={cn(getMenuItemClass("/find-pathology-labs"))}>
                <Link href="/find-pathology-labs">Find Pathology Labs</Link>
              </MenubarItem>
              <MenubarItem asChild className={cn(getMenuItemClass("/find-hospitals"))}>
                <Link href="/find-hospitals">Find Hospitals</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
}
