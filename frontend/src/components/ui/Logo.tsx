import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({ className = "h-9 w-auto", showSubtitle = true }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center">
        <svg
          className={className}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="12" fill="var(--color-primary-container, #102a43)" />
          <path
            d="M12 21L18 27L29 14"
            stroke="#FFFDF7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tricolour saffron & green accents */}
          <circle cx="32" cy="8" r="4" fill="#FF9933" />
          <circle cx="8" cy="32" r="4" fill="#138808" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            अधिकार Adhikaar
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
        </div>
        {showSubtitle && (
          <span className="font-label-sm text-[11px] text-on-surface-variant tracking-wide -mt-0.5">
            Civic Assistance Platform
          </span>
        )}
      </div>
    </Link>
  );
}
