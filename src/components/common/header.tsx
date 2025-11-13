import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Building2 className="h-7 w-7 text-accent" />
          <span className="text-xl font-bold tracking-tight text-foreground font-headline">
            LocalConnect
          </span>
        </Link>
        <div className="w-full max-w-sm">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
