"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useChat } from "@/contexts/ChatContext";

export default function Home() {
  const { openChat } = useChat();
  const [problemQuery, setProblemQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fillQuery = (text: string) => {
    setProblemQuery(text);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleVoiceSim = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setProblemQuery("मुझे 3 महीने से मजदूरी नहीं मिली है, ठेकेदार फोन नहीं उठा रहा");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleAnalyze = () => {
    if (!problemQuery.trim()) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    openChat(problemQuery);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)]">
      {/* Subtle Atmospheric Gradient Layer */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-surface-container via-surface-container-low/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-[-5%] w-96 h-96 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 left-[-5%] w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="page-container pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 flex flex-col items-center text-center">
          {/* Saffron-to-Emerald Tricolour Inspired Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container shadow-sm mb-6 sm:mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF9933]" />
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              AI-Powered Indian Civic Assistance
            </span>
            <span className="text-outline-variant text-[10px]">·</span>
            <span className="font-label-sm text-label-sm text-secondary font-bold">
              Free &amp; Impartial
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#138808]" />
          </div>

          {/* Main Heading & Subtitle */}
          <h1 className="font-display text-display text-primary max-w-4xl tracking-tight leading-[1.18]">
            Know your rights. <br className="hidden sm:inline" />
            Discover your benefits.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-5 sm:mt-6 leading-relaxed">
            Tell Adhikaar what you&apos;re dealing with. We&apos;ll help you understand what statutory support may be available, required documents, and what verified action you can take next.
          </p>

          {/* PRIMARY PROBLEM INPUT (Interactive Centerpiece) */}
          <div className="w-full max-w-3xl mt-10 sm:mt-12 text-left bg-surface-container-lowest rounded-2xl shadow-xl p-6 sm:p-8 relative transition-all duration-300 hover:shadow-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  shield
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                  Citizen Query Assistant
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-0.5 rounded-full">
                English · हिंदी · ਪੰਜਾਬੀ
              </span>
            </div>

            {/* Input Area */}
            <div className="relative mt-2">
              <textarea
                ref={inputRef}
                value={problemQuery}
                onChange={(e) => setProblemQuery(e.target.value)}
                className="w-full bg-transparent resize-none font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none leading-relaxed min-h-[96px] py-1"
                id="problem-input"
                placeholder="Tell us what you're dealing with in simple words... (e.g. 'मुझे पिछले 2 महीने की salary नहीं मिली', 'Landlord kept my security deposit', or 'Scholarships for rural engineering students')"
                rows={3}
              />
            </div>

            {/* Action Bar Inside Centerpiece */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-4 bg-surface-container-low/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-4 sm:py-5 rounded-b-2xl border-t border-outline-variant/20">
              <button
                type="button"
                id="voice-mic-btn"
                onClick={toggleVoiceSim}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer ${
                  isListening
                    ? "bg-error-container text-error"
                    : "bg-surface-container-lowest text-primary hover:bg-surface-container"
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] text-error ${isListening ? "animate-pulse" : ""}`}>
                  mic
                </span>
                <span className="font-label-md text-label-md font-semibold">
                  {isListening ? "Listening... (Hindi/English)" : "Speak in your language"}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer font-semibold"
                >
                  <span className="font-label-md text-label-md font-bold">Get Guidance</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Suggested Pills */}
          <div className="w-full max-w-3xl mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
              Common issues:
            </span>
            <button
              type="button"
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full transition-colors active:scale-95 cursor-pointer"
              onClick={() => fillQuery("Unpaid salary for 3 months from local garment export unit")}
            >
              Unpaid salary / Labour
            </button>
            <button
              type="button"
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full transition-colors active:scale-95 cursor-pointer"
              onClick={() => fillQuery("How to apply for priority ration card (NFSA) online in Haryana?")}
            >
              Ration card application
            </button>
            <button
              type="button"
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full transition-colors active:scale-95 cursor-pointer"
              onClick={() => fillQuery("Landlord refuses to refund ₹45,000 security deposit without damages")}
            >
              Tenant dispute
            </button>
            <button
              type="button"
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full transition-colors active:scale-95 cursor-pointer"
              onClick={() => fillQuery("Old age pension eligibility criteria for BPL widow aged 63 years")}
            >
              Elderly pension
            </button>
            <button
              type="button"
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-1.5 rounded-full transition-colors active:scale-95 cursor-pointer"
              onClick={() => fillQuery("Received SMS saying electricity will be cut tonight unless I click this link")}
            >
              Verify suspicious SMS
            </button>
          </div>

          {/* Secondary Row CTA Link */}
          <div className="flex items-center gap-3 mt-8 sm:mt-10">
            <Link
              href="/schemes"
              className="flex items-center gap-2 font-title-md text-title-md text-primary hover:text-secondary transition-colors font-semibold"
            >
              <span>Explore all 450+ verified central &amp; state schemes</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
          </div>
        </section>
      </div>

      {/* REAL-TIME IMPACT STATS TICKER STRIP */}
      <section className="w-full bg-surface-container-low py-8 sm:py-10 shadow-sm border-y border-outline-variant/20">
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary font-bold">450+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Central &amp; State Schemes
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-secondary font-bold">670+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              DLSA Legal Aid Clinics
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary font-bold">100%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Statutory Gazette Citations
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-tertiary font-bold">₹0</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Citizen Access Fees (Free Forever)
            </span>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS GRID ("Start with what you need") */}
      <section className="page-container py-16 sm:py-20 lg:py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-3">
          <div className="flex flex-col max-w-xl">
            <span className="font-label-md text-label-md text-secondary font-bold tracking-wide uppercase">
              Civic Directory
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1 font-bold">
              Start with what you need
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Direct conduits to institutional remedies, statutory entitlements, and official dispute filings.
            </p>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Updated daily from India Code &amp; Gazette
          </span>
        </div>

        {/* 6 Bespoke Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {/* 1. Schemes */}
          <Link
            href="/schemes"
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">policy</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Government Schemes
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Check direct eligibility, subsidy brackets, and documentation across 450+ central and state programs.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                DBT, PM-KISAN, PMAY &amp; more
              </span>
            </div>
          </Link>

          {/* 2. Legal Help */}
          <Link
            href="/legal-help"
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">gavel</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Legal Rights &amp; Standing
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Plain-spoken breakdowns of statutory acts: labour wages, consumer grievances, tenancy, and civil entitlements.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Citing India Code statutes
              </span>
            </div>
          </Link>

          {/* 3. Check a Scam */}
          <div
            onClick={() => fillQuery("Check if this message is authentic: Congratulations you won ₹50000 lottery click here")}
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">verified_user</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Check a Scam or Link
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Paste suspicious WhatsApp forwards, lottery SMS, or fake recruitment letters to evaluate authenticity against official cyber bulletins.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">
                1930 Cyber Helpline Integrated
              </span>
            </div>
          </div>

          {/* 4. Find Free Legal Aid */}
          <Link
            href="/legal-help#dlsa-finder"
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed-dim/40 flex items-center justify-center text-secondary mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">account_balance</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Find Free Legal Aid
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Locate your District Legal Services Authority (DLSA), Taluk committee, and pro-bono empanelled advocates under NALSA.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Section 12 Legal Services Act
              </span>
            </div>
          </Link>

          {/* 5. Documents & Templates */}
          <Link
            href="/resources"
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">description</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Documents &amp; Templates
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Generate standardized RTI applications, formal dispute notices, demand letters, and consumer forum drafts in seconds.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                RTI Act Formats · 14 Languages
              </span>
            </div>
          </Link>

          {/* 6. Deadlines & Reminders */}
          <Link
            href="/resources"
            className="group p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border border-outline-variant/20"
          >
            <div className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim/60 flex items-center justify-center text-primary mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">event_available</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  Deadlines &amp; Reminders
                </h3>
                <span className="material-symbols-outlined text-outline text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
                Statutory limitation periods for complaints, ITR deadlines, scholarship submission windows, and civil appeal cutoffs.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-3.5 bg-surface-container-low/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 px-6 sm:px-7 py-3 rounded-b-2xl border-t border-outline-variant/15">
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                SMS / WhatsApp alerts
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* HOW ADHIKAAR WORKS (3-Step Editorial Chapter) */}
      <section className="w-full bg-surface-container-low py-16 sm:py-20 lg:py-24 border-y border-outline-variant/20">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="font-label-md text-label-md text-secondary font-bold tracking-wide uppercase">
              Dignified Process
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1 font-bold">
              How Adhikaar assists you
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Engineered to convert bureaucratic complexity into sequential, empowering citizen action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20 min-h-[240px]">
              <div className="absolute top-4 right-5 font-display text-[44px] text-surface-container-highest font-bold leading-none select-none">
                01
              </div>
              <div className="flex flex-col z-10">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-title-md mb-5 font-bold">
                  1
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Tell us what happened
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                  Express your situation in simple everyday speech or text. You don&apos;t need legal jargon or formal English — we understand colloquial Hindi, regional idioms, and conversational context.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20 min-h-[240px]">
              <div className="absolute top-4 right-5 font-display text-[44px] text-surface-container-highest font-bold leading-none select-none">
                02
              </div>
              <div className="flex flex-col z-10">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-title-md mb-5 font-bold">
                  2
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Statutory discovery &amp; eligibility
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                  Our system evaluates your query against India Code, Central Gazettes, and Welfare Directories to instantly isolate applicable acts, exemptions, and entitlement clauses.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20 min-h-[240px]">
              <div className="absolute top-4 right-5 font-display text-[44px] text-surface-container-highest font-bold leading-none select-none">
                03
              </div>
              <div className="flex flex-col z-10">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-title-md mb-5 font-bold">
                  3
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Verified institutional recourse
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                  Receive pre-drafted legal notices, official grievance portal links, direct DLSA legal aid contact coordinates, and sequential checklists to resolve your matter with dignity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITIZEN IMPACT GALLERY */}
      <section className="page-container py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Maternity & Family Welfare"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2o1-25eY-iu3qAgRR4g0LmTiUMhy-RVjmtNCi7X8htOf9xV9F5AN-2OJei-vnoVRNtD5qegN1YMztOFHwflc35gB8k8hsJzaHxOuFUqS8vI6OEnUkSNsOYscrW1MH4MKZlU3iQVLXi4hNOZixi9TJF0sM00Dbg8Xk8dqCED5AgKRdTtUPuIeb7ntpUvib0sgibBv-K2dIPj9dc1WRLMDkyW7l_btR6ZPr_YDxLVG3G7HVkU-wwnO"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-6 text-on-primary">
              <span className="font-label-sm text-label-sm font-bold text-secondary-fixed">
                Maternity &amp; Family Welfare
              </span>
              <p className="font-title-md text-title-md font-bold mt-1.5 leading-snug">
                ₹6,000 Direct Support via PMMVY
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Higher Education Grants"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJQqoC8dH5JNpKhGvM1XGFWo9N_qDp_ZPYfAJIKmE4Y3P6bVuBLAmXH1FisprSOXRKQ5yd7KknQeX0PQJ91VAfSrc-nRhkIgLAXJq4ZDQQ8Srt4Hfvw8jCPlmqJ-MvHGFW904ywT49BKp4v0YD9erEj5ho6K2DdtfrkpNFmJgmUMFWX8jDbW_iWFIUIo-CDkU-29vb44sOmgx2LUO3_bwGo4KjtBS-AAcxd5sdZua42G0Xq8sLGwVE"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-6 text-on-primary">
              <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed">
                Higher Education Grants
              </span>
              <p className="font-title-md text-title-md font-bold mt-1.5 leading-snug">
                National Scholarship Portal Integration
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Senior Citizen Security"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOoGkZKroiH1qlmSTaxQB_on5pb2xgsYmnlrUn2foklD6kF2guYZa3VqwcWSXQVST37Z08pTKV7qJq03R_tNTURdE93216pHAibPGcsbrrfnFqUwdgTW4m-T1VdPLR-MMspD0W_Gy0tb1r27TCRU3VXFpW21AZ_fX5oRqKtqrp1ETnUa70-FUaX-yYj68RCrFgG43D9Kk_fMIVmrMtnNZwNXEr2lYXR2TLSMzjcoutQjigPd5nPOmV"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-6 text-on-primary">
              <span className="font-label-sm text-label-sm font-bold text-secondary-fixed">
                Senior Citizen Security
              </span>
              <p className="font-title-md text-title-md font-bold mt-1.5 leading-snug">
                IGNOAPS Old Age Pension Assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="page-container pb-16 sm:pb-24 w-full">
        <div className="bg-primary text-on-primary rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary-container rounded-full blur-2xl opacity-40 pointer-events-none" />
          <div className="absolute right-32 bottom-0 w-48 h-48 bg-secondary/30 rounded-full blur-xl pointer-events-none" />
          <div className="flex flex-col max-w-xl z-10 text-center md:text-left">
            <span className="font-label-md text-label-md text-secondary-fixed font-bold tracking-wide uppercase">
              Open Citizen Access
            </span>
            <h2 className="font-headline-lg text-headline-lg mt-2 leading-[1.2] font-bold">
              Empowering citizens with clarity, confidence, and dignity.
            </h2>
            <p className="font-body-md text-body-md text-primary-fixed mt-3 leading-relaxed">
              No waiting lines, no middlemen fees, and no legal intimidation. Discover what the Constitution of India and national welfare laws entitle you to today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                  inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="px-7 py-3.5 bg-secondary text-on-secondary rounded-full font-label-md text-label-md font-bold hover:bg-opacity-90 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Start Free Assessment
            </button>
            <Link
              href="/about"
              className="px-5 py-3.5 bg-transparent text-primary-fixed hover:text-on-primary font-label-md text-label-md font-semibold transition-colors"
            >
              Read About the Initiative →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
