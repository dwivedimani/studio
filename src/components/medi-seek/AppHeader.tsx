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

export default function AppHeader() {
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
              <Button variant="ghost" className="text-foreground hover:bg-accent/10">
                <Search className="mr-2 h-4 w-4" /> Find Services
              </Button>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild>
                <Link href="/find-pharmacies">Find Pharmacies</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/find-doctors">Find Doctors</Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem asChild>
                <Link href="/find-pathology-labs">Find Pathology Labs</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/find-hospitals">Find Hospitals</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
}
