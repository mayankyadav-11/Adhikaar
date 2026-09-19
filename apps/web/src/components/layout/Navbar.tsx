"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useTheme } from "@/contexts/ThemeContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Schemes", href: "/schemes" },
  { name: "Legal Help", href: "/legal-help" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20 transition-colors">
      <div className="page-container flex items-center justify-between h-20">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`py-2 px-1 transition-colors ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "font-title-md text-title-md text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Language, Theme Toggle, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-xl shadow-[0_1px_3px_rgba(16,42,67,0.05)] cursor-pointer group hover:bg-surface-container transition-all"
            >
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface">
                    {selectedLang}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </div>
                <span className="font-label-sm text-[10px] text-on-surface-variant hidden lg:inline">
                  English · हिंदी · ਪੰਜਾਬੀ
                </span>
              </div>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-1 z-50">
                {[
                  { label: "English", sub: "National" },
                  { label: "हिंदी", sub: "Hindi" },
                  { label: "ਪੰਜਾਬੀ", sub: "Punjabi" },
                  { label: "বাংলা", sub: "Bengali" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedLang(item.label);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center justify-between text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-on-surface-variant text-[11px]">{item.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Auth State: Signed In or Signed Out */}
          {isSignedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer select-none"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-md font-bold shadow-sm">
                    <span>RK</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-surface-container-lowest" />
                </div>
                <div className="hidden lg:flex flex-col text-left ml-1">
                  <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                    Rajesh Kumar
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant leading-none">
                    Dossier #4829
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant ml-0.5">
                  expand_more
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 p-2 z-50">
                  <div className="px-3 py-2 border-b border-outline-variant/30">
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Rajesh Kumar
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      rajesh.k@citizens.gov.in
                    </p>
                    <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Aadhaar-Seeded eKYC
                    </div>
                  </div>
                  <div className="py-1.5">
                    <Link
                      href="#"
                      className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        account_circle
                      </span>
                      My Profile & Standing
                    </Link>
                    <Link
                      href="/schemes"
                      className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        folder_shared
                      </span>
                      Saved Schemes & Claims
                    </Link>
                    <Link
                      href="/legal-help"
                      className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        draft
                      </span>
                      Generated Legal Notices
                    </Link>
                  </div>
                  <div className="border-t border-outline-variant/30 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignedIn(false);
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-body-sm text-error hover:bg-error-container rounded-lg transition-colors text-left font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSignedIn(true)}
                className="font-label-md text-label-md text-on-surface px-4 py-2 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignedIn(true)}
                className="font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary px-4 py-2 rounded-full transition-all shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-3 rounded-lg font-title-md text-title-md ${
                pathname === link.href
                  ? "bg-surface-container text-primary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
