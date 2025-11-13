import { Building2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-accent" />
          <p className="text-sm font-semibold">LocalConnect</p>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} LocalConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
