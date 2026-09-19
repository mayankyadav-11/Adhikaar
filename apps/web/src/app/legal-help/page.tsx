"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useChat } from "@/contexts/ChatContext";

const domains = [
  {
    id: "labour",
    title: "Labour & Unpaid Wages",
    statute: "Payment of Wages Act, 1936 · Industrial Disputes Act",
    desc: "Delayed salaries, sudden unlawful termination, PF non-deposit, overtime disputes, and contract worker exploitation.",
    icon: "engineering",
    accent: "bg-secondary-fixed/40 text-secondary",
  },
  {
    id: "consumer",
    title: "Consumer Rights & Deficiencies",
    statute: "Consumer Protection Act, 2019",
    desc: "E-commerce non-delivery, refusal of refunds, defective appliances, airline ticket cancellations, and unfair trade practices.",
    icon: "shopping_cart",
    accent: "bg-primary-fixed text-primary",
  },
  {
    id: "tenancy",
    title: "Tenancy & Security Deposits",
    statute: "Model Tenancy Act · State Rent Control Acts",
    desc: "Illegal withholding of rental deposits, arbitrary rent hikes, eviction without statutory notice period, and utility disruptions.",
    icon: "home",
    accent: "bg-tertiary-fixed text-on-tertiary-container",
  },
  {
    id: "women",
    title: "Women & Domestic Protection",
    statute: "DV Act, 2005 · POSH Act, 2013",
    desc: "Maintenance rights, workplace sexual harassment redressal committees, domestic abuse injunctions, and one-stop shelter crisis lines.",
    icon: "shield_person",
    accent: "bg-secondary-fixed text-secondary",
  },
  {
    id: "cyber",
    title: "Cyber Fraud & Financial Scams",
    statute: "Information Technology Act, 2000 · RBI Mandates",
    desc: "UPI fraud, unauthorized ATM debit, phishing scams, loan app blackmail, and 24-hour bank chargeback mandates.",
    icon: "security",
    accent: "bg-error-container text-error",
  },
  {
    id: "nalsa",
    title: "Free Legal Aid & NALSA Clinics",
    statute: "Section 12, Legal Services Authorities Act, 1987",
    desc: "Pro-bono court advocate appointment for women, SC/ST citizens, industrial workmen, and persons with annual income under prescribed limits.",
    icon: "gavel",
    accent: "bg-primary-fixed-dim/50 text-primary",
  },
];

export default function LegalHelpPage() {
  const { openChat } = useChat();
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [selectedState, setSelectedState] = useState("Haryana");
  const [selectedDistrict, setSelectedDistrict] = useState("Gurugram");

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)]">
      {/* Top Statutory Scrim Accent */}
      <div className="relative w-full overflow-hidden bg-surface-container-low pb-14 sm:pb-20 border-b border-outline-variant/20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-secondary-fixed opacity-30 blur-3xl pointer-events-none" />

        <div className="page-container pt-10 sm:pt-14 lg:pt-16">
          {/* Legal Notice Disclaimer Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface-container text-on-surface-variant shadow-sm mb-10 sm:mb-12 border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">
                gavel
              </span>
              <p className="font-body-sm text-body-sm leading-relaxed">
                <span className="font-bold text-on-surface">Statutory Notice:</span> Adhikaar
                provides verified legal information and procedural guidance under Indian law. We do
                not provide court representation.
              </p>
            </div>
            <a
              href="#dlsa-finder"
              className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-container transition-colors whitespace-nowrap self-start sm:self-center font-bold flex items-center gap-1 shrink-0"
            >
              Find Pro-Bono DLSA Aid
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          {/* Hero Header Typography & Context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5">
              <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-bold">
                  Plain-Language Legal Rights &amp; Redressal
                </span>
              </div>
              <h1 className="font-display text-display text-primary tracking-tight font-bold leading-[1.18]">
                Know where you stand.
                <br />
                <span className="font-headline-lg text-headline-lg text-secondary italic font-normal">
                  Know what to do next.
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Understand everyday legal challenges in plain English, Hindi, or Punjabi. Get direct
                statutory citations, official dispute drafts, grievance portals, and verified Legal
                Services Authority clinics across India.
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 pt-3 max-w-xl">
                <div className="p-4 sm:p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Statutes Indexed
                  </span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    142+
                  </span>
                </div>
                <div className="p-4 sm:p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    DLSA Clinics
                  </span>
                  <span className="font-headline-md text-headline-md text-secondary font-bold">
                    672
                  </span>
                </div>
                <div className="p-4 sm:p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Resolution Rate
                  </span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    84%
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side Constitutional Mandate Card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-primary-container text-on-primary shadow-xl overflow-hidden border border-outline-variant/20">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-secondary opacity-20 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-sm text-label-sm text-primary-fixed tracking-wide uppercase font-bold">
                    Constitutional Mandate
                  </span>
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                    balance
                  </span>
                </div>
                <p className="font-headline-sm text-headline-sm text-inverse-on-surface italic mb-3 leading-relaxed">
                  &ldquo;Justice: social, economic and political; Liberty of thought, expression,
                  belief, faith and worship...&rdquo;
                </p>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                  Preamble to the Constitution of India · Article 39A
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 LEGAL DOMAIN CARDS */}
      <section className="page-container py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col mb-10 sm:mb-12">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            Statutory Domains
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1.5">
            Everyday Legal Rights &amp; Remedies
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
            Choose the area matching your dispute for immediate statutory analysis and draft
            generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {domains.map((dom) => (
            <div
              key={dom.id}
              onClick={() =>
                openChat(
                  `I need legal assistance regarding ${dom.title}. What are my rights and next steps?`
                )
              }
              className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-outline-variant/20 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${dom.accent} group-hover:scale-105 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-[26px]">{dom.icon}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold">
                  {dom.title}
                </h3>
                <span className="font-label-sm text-[11px] text-secondary font-semibold block mt-1.5">
                  {dom.statute}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                  {dom.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center justify-between text-label-sm font-semibold text-primary">
                <span>Start Case Analysis</span>
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE CASE WALKTHROUGH WITH TABS */}
      <section className="w-full bg-surface-container-low py-16 sm:py-20 lg:py-24 border-y border-outline-variant/20">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
              Interactive Case Model
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1.5">
              Sample Walkthrough: Unpaid Wage Dispute
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Follow how an ordinary grievance is escalated through formal statutory pathways.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-outline-variant/20 overflow-x-auto bg-surface-container-low/60 px-2 pt-1 gap-1">
              {[
                { id: "diagnosis", label: "1. Diagnosis & Facts" },
                { id: "standing", label: "2. Statutory Standing" },
                { id: "evidence", label: "3. Evidence Checklist" },
                { id: "redressal", label: "4. Sequential Redressal" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 sm:px-7 py-3.5 font-title-md text-title-md transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
                    activeTab === tab.id
                      ? "bg-surface-container-lowest text-primary font-bold border-b-2 border-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Panels */}
            <div className="p-6 sm:p-8 lg:p-10">
              {activeTab === "diagnosis" && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Case Facts: Unpaid Wages for 2 Months
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed max-w-3xl">
                    A machine operator employed on a monthly salary of ₹19,000 has not been paid for
                    September and October. The employer gives excuses and verbally threatens
                    dismissal if a written complaint is made.
                  </p>
                  <div className="p-5 sm:p-6 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-4 mt-2">
                    <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5">
                      verified
                    </span>
                    <div>
                      <p className="font-title-md text-title-md font-bold text-primary">
                        Adhikaar Diagnosis: Prima Facie Breach
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                        Violation of Section 5 of Payment of Wages Act, 1936. Employer must disburse
                        earned wages before the 7th or 10th of each following calendar month.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "standing" && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Statutory Provisions &amp; Relief
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
                    <div className="p-5 sm:p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wide">
                        Section 15, Payment of Wages Act
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface mt-2 leading-relaxed">
                        Provides for claim applications for unauthorized deductions or delayed wages
                        with compensation up to 10 times the amount deducted.
                      </p>
                    </div>
                    <div className="p-5 sm:p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wide">
                        Industrial Disputes Act, Section 33C(2)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface mt-2 leading-relaxed">
                        Direct recovery of monetary entitlements due from employer through Labour
                        Court orders enforceable as land revenue arrears.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "evidence" && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Essential Evidence to Preserve
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                    {[
                      "Bank passbook statement showing past salary credits",
                      "WhatsApp messages, SMS or emails with employer",
                      "Gate pass, attendance card, or ID card photographs",
                      "Appointment letter, offer letter, or wage slips",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20"
                      >
                        <span className="material-symbols-outlined text-secondary shrink-0">
                          check_box
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "redressal" && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Sequential Action Plan
                  </h3>
                  <div className="flex flex-col gap-3.5 mt-1">
                    <div className="p-5 rounded-xl bg-surface-container-low flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <span className="font-title-md text-title-md text-primary font-bold">
                          Issue Registered Demand Notice
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                          Grant 7-15 days for payment via Speed Post or Registered Email.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-surface-container-low flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <span className="font-title-md text-title-md text-primary font-bold">
                          File Grievance on Samadhan Portal
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                          Online conciliation petition to Assistant Labour Commissioner.
                        </p>
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-surface-container-low flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <span className="font-title-md text-title-md text-primary font-bold">
                          Free Legal Aid via District DLSA
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                          Pro-bono advocate appointed under Legal Services Authorities Act.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DLSA FINDER SECTION */}
      <section id="dlsa-finder" className="page-container py-16 sm:py-20 lg:py-24">
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-outline-variant/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
                NALSA Network Locator
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1.5">
                Find Your District Legal Services Authority (DLSA)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                Every district court complex in India houses a free legal aid clinic offering
                pro-bono advocates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-1.5">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-surface text-on-surface p-3.5 rounded-xl border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none"
              >
                <option>Haryana</option>
                <option>Punjab</option>
                <option>Delhi NCT</option>
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-1.5">
                Select District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-surface text-on-surface p-3.5 rounded-xl border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none"
              >
                <option>Gurugram</option>
                <option>Faridabad</option>
                <option>Ambala</option>
                <option>Rohtak</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  alert(`Showing DLSA Contact Info for ${selectedDistrict}, ${selectedState}`)
                }
                className="w-full py-3.5 bg-primary hover:bg-opacity-90 text-on-primary rounded-xl font-label-md text-label-md font-bold transition-colors cursor-pointer shadow-sm"
              >
                Locate Authority
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wide">
                Active Clinic Found
              </span>
              <h4 className="font-title-lg text-title-lg text-primary font-bold mt-1.5">
                DLSA {selectedDistrict} · District &amp; Sessions Court Complex
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                Room No. 104, Ground Floor, District Court Complex, {selectedDistrict},{" "}
                {selectedState}
              </p>
              <p className="font-body-sm text-body-sm text-primary font-semibold mt-2">
                Helpline: 15100 (Toll-Free 24x7) · Working Hours: 10:00 AM – 5:00 PM
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                openChat(
                  `Please provide guidance on filing a free legal aid application at DLSA ${selectedDistrict}.`
                )
              }
              className="px-6 py-3 bg-secondary text-on-secondary rounded-full font-label-md text-label-md font-bold hover:bg-opacity-90 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              Request Appointment Guidance
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
