"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-10 sm:py-14 lg:py-16">
      <div className="page-container-narrow">
        <header className="mb-10 sm:mb-12">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            Our Mission &amp; Foundation
          </span>
          <h1 className="font-display text-display text-primary font-bold mt-1.5 tracking-tight">
            Democratizing Statutory Justice for Every Citizen
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 leading-relaxed">
            Adhikaar is built on the belief that knowing your rights and accessing government welfare should not require legal intermediaries, bribes, or bureaucratic fear.
          </p>
        </header>

        <div className="flex flex-col gap-8 sm:gap-10 text-on-surface">
          <section className="p-6 sm:p-8 lg:p-10 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 sm:mb-4">
              Constitutional Roots: Article 39A
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The Constitution of India directs the State to secure that the operation of the legal system promotes justice on a basis of equal opportunity, and shall, in particular, provide free legal aid by suitable legislation or schemes. Adhikaar acts as the digital infrastructure that puts these protections directly into the hands of citizens.
            </p>
          </section>

          <section className="p-6 sm:p-8 lg:p-10 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-3 sm:mb-4">
              Core Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
                <span className="font-title-md text-title-md text-primary font-bold block">
                  100% Impartial &amp; Free
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  We charge zero fees to citizens. No sponsored schemes or commercial prioritization.
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
                <span className="font-title-md text-title-md text-secondary font-bold block">
                  Strict Data Privacy
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  We never store Aadhaar numbers, PAN numbers, or biometrics. All eligibility calculations happen with minimal anonymized descriptors.
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
                <span className="font-title-md text-title-md text-primary font-bold block">
                  Multi-Lingual Inclusivity
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  Designed for Bharat. Voice and text support in Hindi, Punjabi, Bengali, Tamil, Telugu, and more.
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
                <span className="font-title-md text-title-md text-secondary font-bold block">
                  Gazette Citations
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  Every guidance card references specific acts, official gazette notifications, and verified government portals.
                </p>
              </div>
            </div>
          </section>

          <div className="flex justify-center pt-6 sm:pt-8">
            <Link
              href="/"
              className="px-8 py-3.5 bg-primary hover:bg-opacity-90 text-on-primary rounded-full font-label-md text-label-md font-bold shadow-md transition-all cursor-pointer"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
