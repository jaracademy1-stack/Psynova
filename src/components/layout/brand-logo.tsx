import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markOnly?: boolean;
};

export function BrandLogo({ className, markOnly = false }: BrandLogoProps) {
  return (
    <Image
      src={markOnly ? "/psynova-mark.svg" : "/psynova-logo.svg"}
      alt="Psynova"
      width={markOnly ? 256 : 640}
      height={markOnly ? 220 : 300}
      className={cn("h-12 w-auto", className)}
      priority={markOnly}
      unoptimized
    />
  );
}
