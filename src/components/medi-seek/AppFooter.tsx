export default function AppFooter() {
  return (
    <footer className="bg-card shadow-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MediSeek. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This tool is for informational purposes only and does not constitute medical advice. Always consult with a healthcare professional for any health concerns or before making any decisions related to your health or treatment.
        </p>
      </div>
    </footer>
  );
}
