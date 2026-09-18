"use client";

import React from "react";
import Link from "next/link";
import { useChat } from "@/contexts/ChatContext";

const resources = [
  {
    title: "Standard RTI Application Draft (Format A)",
    desc: "Right to Information template citing Section 6(1) for requesting official public records.",
    category: "RTI Act, 2005",
    icon: "description",
  },
  {
    title: "Statutory 7-Day Unpaid Salary Demand Notice",
    desc: "Formal registered notice citing Payment of Wages Act, 1936 with statutory compensation clause.",
    category: "Labour Law",
    icon: "mail",
  },
  {
    title: "Security Deposit Refund Notice for Tenants",
    desc: "Model Tenancy framework notice requesting refund of withheld deposit with interest.",
    category: "Tenancy Law",
    icon: "home_work",
  },
  {
    title: "Consumer Dispute Formal Pre-Litigation Notice",
    desc: "Draft notice under Section 35 of Consumer Protection Act, 2019 for defective products and services.",
    category: "Consumer Law",
    icon: "shopping_bag",
  },
  {
    title: "Cyber Financial Fraud 24-Hour Bank Intimation",
    desc: "RBI Zero-Liability framework intimation letter for unauthorized electronic transactions.",
    category: "Cyber & Banking",
    icon: "phonelink_lock",
  },
  {
    title: "DLSA Free Legal Aid Application Form",
    desc: "Standard form for appointment of panel advocate under Section 12 of NALSA Act.",
    category: "Legal Aid",
    icon: "gavel",
  },
];

export default function ResourcesPage() {
  const { openChat } = useChat();

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-space-xl">
      <div className="max-w-7xl mx-auto px-margin">
        <header className="max-w-3xl mb-space-xl">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            Public Civic Repository
          </span>
          <h1 className="font-display text-display text-primary font-bold mt-1">
            Documents, Forms &amp; Statutory Templates
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
            Download standardized, verified dispute notices, RTI applications, and compliance checklists in 14 Indian languages.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {resources.map((res, i) => (
            <div
              key={i}
              className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl transition-all border border-outline-variant/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                    {res.category}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    {res.icon}
                  </span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary font-bold">
                  {res.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  {res.desc}
                </p>
              </div>

              <div className="mt-space-lg pt-space-md border-t border-outline-variant/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert(`Downloading template for ${res.title}`)}
                  className="font-label-sm text-label-sm text-primary hover:text-secondary font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download Form
                </button>
                <button
                  type="button"
                  onClick={() => openChat(`Help me fill out the ${res.title}`)}
                  className="font-label-sm text-label-sm text-secondary hover:underline font-semibold cursor-pointer"
                >
                  AI Guided Draft →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
