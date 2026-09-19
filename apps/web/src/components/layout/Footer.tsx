import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ApiStatusIndicator from "@/components/ui/ApiStatusIndicator";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-16 sm:mt-24 pt-16 sm:pt-20 pb-12 shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-outline-variant/20 transition-colors">
      <div className="page-container flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* Brand Mission */}
          <div className="flex flex-col max-w-sm gap-3">
            <Logo showSubtitle={false} />
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              An open-access constitutional empowerment initiative providing statutory knowledge,
              ministry-verified schemes, and civic aid across India.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-24">
            <div className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-3">
              <span className="font-label-md text-label-md text-primary font-bold">Platform</span>
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

            <div className="flex flex-col gap-3">
              <span className="font-label-md text-label-md text-primary font-bold">Governance</span>
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
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-start gap-3.5 border border-outline-variant/15">
          <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="leading-relaxed">
            <strong className="text-on-surface font-semibold">Verified Civic Notice:</strong>{" "}
            Adhikaar provides verified information and links to official resources. It does not
            replace professional legal advice.
          </p>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant/20 text-on-surface-variant">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-label-sm text-label-sm">
              © 2025 Adhikaar Civic Assistance Platform.
            </span>
            <span className="text-outline-variant text-[10px] hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant/80">
                System:
              </span>
              <ApiStatusIndicator variant="compact" />
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Proudly built for Indian Civic-Tech Inclusion
          </span>
        </div>
      </div>
    </footer>
  );
}
