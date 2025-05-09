import { StethoscopeIcon } from 'lucide-react'; // Using StethoscopeIcon as a more relevant icon

export default function AppHeader() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <StethoscopeIcon className="h-8 w-8 text-accent mr-3" />
        <h1 className="text-3xl font-bold text-foreground">
          Medi<span className="text-accent">Seek</span>
        </h1>
      </div>
    </header>
  );
}
