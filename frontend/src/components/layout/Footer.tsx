import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-2xl pt-space-2xl pb-space-xl shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-outline-variant/20 transition-colors">
      <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-space-xl">
          {/* Brand Mission */}
          <div className="flex flex-col max-w-sm gap-space-sm">
            <Logo showSubtitle={false} />
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              An open-access constitutional empowerment initiative providing statutory knowledge, ministry-verified schemes, and civic aid across India.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="flex flex-wrap gap-space-2xl">
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary font-bold">
                Civic Services
              </span>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/schemes"
              >
                National Schemes
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/legal-help"
              >
                Legal Aid Directory
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/resources"
              >
                Statutory Documents
              </Link>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary font-bold">
                Platform
              </span>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                About Initiative
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                Contact
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                Accessibility
              </Link>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-primary font-bold">
                Governance
              </span>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                Privacy Policy
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                Terms of Service
              </Link>
              <Link
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="/about"
              >
                Data Deletion
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Notice Box */}
        <div className="p-space-md rounded-xl bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">
            verified_user
          </span>
          <p>
            <strong>Verified Civic Notice:</strong> Adhikaar provides verified information and links to official resources. It does not replace professional legal advice.
          </p>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md border-t border-outline-variant/30 text-on-surface-variant">
          <span className="font-label-sm text-label-sm">
            © 2025 Adhikaar Civic Assistance Platform. Built for sovereign citizen access.
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Proudly built for Indian Civic-Tech Inclusion
          </span>
        </div>
      </div>
    </footer>
  );
}
