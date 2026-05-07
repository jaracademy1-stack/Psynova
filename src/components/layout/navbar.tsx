import Link from "next/link";
import { Brain, Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/doctors", label: "Doctors" },
  { href: "/doctor/register", label: "For doctors" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="size-5" />
          </span>
          <span>Psynova</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/doctors"
            className={cn(buttonVariants({ size: "sm" }), "h-8 px-4")}
          >
            Book a Session
          </Link>
        </nav>

        <Link
          href="/doctors"
          aria-label="Browse doctors"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "md:hidden")}
        >
          <Menu />
        </Link>
      </div>
    </header>
  );
}
