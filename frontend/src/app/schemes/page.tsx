"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useChat } from "@/contexts/ChatContext";

const categories = [
  { id: "all", label: "All Sectors (452)" },
  { id: "agri", label: "Agriculture & Farmers (84)" },
  { id: "edu", label: "Students & Education (72)" },
  { id: "women", label: "Women & Child Welfare (68)" },
  { id: "health", label: "Healthcare & Ayushman (51)" },
  { id: "msme", label: "Urban Livelihood & MSME (49)" },
  { id: "senior", label: "Senior Citizens & Pensions (38)" },
];

const mockSchemes = [
  {
    id: "pm-kisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "agri",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    benefit: "₹6,000 / year direct bank transfer (3 equal installments of ₹2,000)",
    statute: "Central Sector Scheme (100% GoI Funding)",
    deadline: "Open All Year",
    criteria: [
      "Small and marginal landholder farmer families",
      "Valid cultivable landholding in revenue records",
      "Aadhaar-seeded bank account mandatory",
    ],
    tags: ["Direct Benefit Transfer", "Agriculture", "Pan-India"],
  },
  {
    id: "pmmay",
    title: "Pradhan Mantri Awas Yojana — Gramin (PMAY-G)",
    category: "agri",
    ministry: "Ministry of Rural Development",
    benefit: "₹1,20,000 grant (plains) / ₹1,30,000 (hilly states) for pucca house construction",
    statute: "National Housing Mission Guidelines",
    deadline: "State Batch Allocation",
    criteria: [
      "Houseless families or households living in kutcha/dilapidated houses",
      "Identified through SECC 2011 deprivation scores",
      "Must not own 3/4-wheeler motorized vehicle",
    ],
    tags: ["Housing", "Rural Infrastructure", "Grants"],
  },
  {
    id: "nsp-postmatric",
    title: "Post-Matric Scholarship Scheme for SC/ST/OBC Students",
    category: "edu",
    ministry: "Ministry of Social Justice & Empowerment",
    benefit: "Full tuition reimbursement + monthly maintenance allowance of ₹550–₹1,200",
    statute: "National Scholarship Portal Framework",
    deadline: "Closes 31st October Annually",
    criteria: [
      "Enrolled in recognized post-matric or post-secondary courses",
      "Annual household family income under ₹2,50,000",
      "No other central scholarship currently drawn",
    ],
    tags: ["Education", "Scholarship", "State-Co-funded"],
  },
  {
    id: "pmmvy",
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "women",
    ministry: "Ministry of Women and Child Development",
    benefit: "₹5,000 in two installments for first child + ₹6,000 for second girl child",
    statute: "Section 4, National Food Security Act (NFSA) 2013",
    deadline: "Within 270 days of pregnancy",
    criteria: [
      "Pregnant Women and Lactating Mothers (PW&LM)",
      "Mother aged 19 years or above at registration",
      "Registered at Anganwadi Centre / Approved Health Facility",
    ],
    tags: ["Maternity", "Nutrition", "Women Welfare"],
  },
  {
    id: "ayushman-bharat",
    title: "Ayushman Bharat PM-JAY (National Health Protection)",
    category: "health",
    ministry: "National Health Authority (NHA)",
    benefit: "Cashless health cover up to ₹5,00,000 per family per year for secondary/tertiary care",
    statute: "National Health Policy 2017 Mandate",
    deadline: "Continuous Lifetime Coverage",
    criteria: [
      "Families listed under SECC 2011 rural and urban deprivation criteria",
      "No restriction on family size, age, or gender",
      "Covers pre-existing conditions from Day 1",
    ],
    tags: ["Healthcare", "Hospitalization", "Insurance"],
  },
  {
    id: "mudra",
    title: "Pradhan Mantri MUDRA Yojana (PMMY) — Shishu & Kishor",
    category: "msme",
    ministry: "Department of Financial Services",
    benefit: "Collateral-free business loans from ₹50,000 up to ₹10,00,000 at subsidized interest",
    statute: "Credit Guarantee Fund for Micro Units (CGFMU)",
    deadline: "Rolling Banking Window",
    criteria: [
      "Non-corporate, non-farm small/micro enterprises",
      "Manufacturing, trading, or service sector ventures",
      "Clean repayment track record (CIBIL > 650)",
    ],
    tags: ["Business Loans", "Micro Enterprise", "Self-Employment"],
  },
];

export default function SchemesPage() {
  const { openChat } = useChat();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States & UTs");

  const filteredSchemes = mockSchemes.filter((scheme) => {
    const matchesCat =
      selectedCategory === "all" || scheme.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-space-xl">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Top Editorial Header & Statutory Badge */}
        <header className="flex flex-col items-start max-w-4xl mb-space-xl">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container text-secondary mb-space-md shadow-sm">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span className="font-label-sm text-label-sm tracking-wide uppercase font-semibold">
              Central &amp; State Welfare Directory · Official Gazette Mapping
            </span>
          </div>
          <h1 className="font-display text-display text-primary tracking-tight mb-space-sm font-bold">
            Find government schemes you are eligible for
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Search over 450+ verified social welfare, education, agricultural, and financial schemes. Filter by your personal socio-economic profile without sharing sensitive identifiers.
          </p>

          {/* Live metrics ticker strip */}
          <div className="flex flex-wrap items-center gap-space-lg mt-space-lg pt-space-sm text-on-surface-variant font-label-md text-label-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-semibold text-on-surface">452 Active Portals Monitored</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-secondary">update</span>
              <span>Last Gazette Sync: 3 hrs ago</span>
            </div>
          </div>
        </header>

        {/* ADVANCED FILTER BAR & SEARCH CONSOLE */}
        <section className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg mb-space-xl border border-outline-variant/20">
          {/* Search Input Container */}
          <div className="relative w-full mb-space-lg">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[24px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, scheme name, or life situation (e.g. scholarship, solar pump, maternity, artisan loan)..."
                className="w-full h-14 pl-12 pr-28 rounded-lg bg-surface text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-all placeholder:text-outline border border-outline-variant/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-space-md px-space-md py-1.5 rounded-md bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Clear
                </button>
              )}
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center gap-space-xs mt-space-sm text-on-surface-variant">
              <span className="font-label-sm text-label-sm mr-1 text-outline">Trending:</span>
              {[
                "Pradhan Mantri Awas",
                "Kisan Credit Card",
                "Girl Child Education",
                "Mudra Loan",
                "Ayushman Bharat",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-space-sm py-0.5 rounded bg-surface text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors border border-outline-variant/20 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sector / Category Multi-select Ribbon */}
          <div className="mb-space-lg">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-md text-label-md text-primary font-bold">
                Target Beneficiary Group:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline"
              >
                Reset Filter
              </button>
            </div>
            <div className="flex flex-wrap gap-space-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-on-primary shadow-sm font-bold"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eligibility Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-md border-t border-outline-variant/20">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                State / Jurisdiction
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-surface text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none"
              >
                <option>All States &amp; UTs</option>
                <option>Haryana</option>
                <option>Punjab</option>
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Bihar</option>
                <option>Delhi NCT</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Social Category
              </label>
              <select className="bg-surface text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none">
                <option>General / All</option>
                <option>OBC (Non-Creamy Layer)</option>
                <option>Scheduled Caste (SC)</option>
                <option>Scheduled Tribe (ST)</option>
                <option>EWS Category</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Annual Household Income
              </label>
              <select className="bg-surface text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none">
                <option>Any Income Bracket</option>
                <option>Under ₹1,00,000 (BPL / Antyodaya)</option>
                <option>₹1,00,000 – ₹2,50,000</option>
                <option>₹2,50,000 – ₹8,00,000</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Land Holding
              </label>
              <select className="bg-surface text-on-surface font-body-sm text-body-sm px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none">
                <option>Any Land Status</option>
                <option>Landless / Non-Agricultural</option>
                <option>Marginal (&lt; 1 Hectare)</option>
                <option>Small (1–2 Hectares)</option>
              </select>
            </div>
          </div>
        </section>

        {/* RESULTS GRID */}
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-title-md text-title-md text-primary font-bold">
            Showing {filteredSchemes.length} Available Schemes
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Verified with Official Gazettes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl transition-all border border-outline-variant/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-space-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                    {scheme.ministry}
                  </span>
                  <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0">
                    {scheme.deadline}
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-primary font-bold leading-snug">
                  {scheme.title}
                </h3>

                <div className="mt-space-md p-space-md rounded-lg bg-surface-container-low/60 border border-outline-variant/15">
                  <div className="flex items-center gap-1.5 text-secondary font-bold text-title-md">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span>Benefit Amount</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface font-medium mt-1">
                    {scheme.benefit}
                  </p>
                </div>

                <div className="mt-space-md">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-bold block mb-1">
                    Key Eligibility Criteria:
                  </span>
                  <ul className="flex flex-col gap-1 text-body-sm text-on-surface">
                    {scheme.criteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-space-lg pt-space-md border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex flex-wrap gap-1">
                  {scheme.tags.map((t) => (
                    <span
                      key={t}
                      className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openChat(`How do I apply for ${scheme.title} and what documents are required?`)}
                  className="px-space-md py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Check Eligibility</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
