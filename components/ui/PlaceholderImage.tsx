"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

type Props = {
  src?: string | null;
  alt: string;
  label?: string | null;
  className?: string;
};

export default function PlaceholderImage({ src, alt, label, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && src.trim() !== "" && !failed;

  if (showImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src as string}
        alt={alt}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-lilac ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(91,61,245,0.18) 0, rgba(91,61,245,0.18) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative z-10 text-center">
        <div className="font-serif text-3xl text-brand">{initials(label ?? alt)}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand/70">
          Photo coming soon
        </div>
      </div>
    </div>
  );
}
