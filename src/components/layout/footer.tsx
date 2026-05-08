import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/doctors", label: "Find doctors" },
  { href: "/doctor/register", label: "For doctors" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/consent", label: "Consent" },
  { href: "/crisis-resources", label: "Crisis resources" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-3">
            <BrandLogo className="h-16 max-w-[220px]" />
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              A booking platform for connecting patients with licensed mental
              health professionals. Built for privacy, clarity, and safe access
              control.
            </p>
          </div>
          <nav className="grid gap-3 text-sm sm:grid-cols-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator />
        <p className="text-xs leading-5 text-muted-foreground">
          Psynova is not an emergency service. If you are in immediate danger or
          facing a medical emergency, contact your local emergency number.
        </p>
      </div>
    </footer>
  );
}
