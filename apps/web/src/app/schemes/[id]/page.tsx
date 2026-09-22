"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import { apiClient } from "@/services/apiClient";
import { Scheme } from "@adhikaar/shared";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Parses multi-line documents_required text into clean array items.
 * Handles numbered bullets, hyphens, or newline-separated items.
 */
function parseDocumentList(raw: string | null): string[] {
  if (!raw) return [];
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const docs: string[] = [];
  for (const line of lines) {
    // Strip leading bullets / numbering like "1.", "1)", "-", "•", "*"
    const cleaned = line.replace(/^(\d+[\.\)]|\-|\*|•)\s*/, "").trim();
    if (cleaned.length > 0) {
      docs.push(cleaned);
    }
  }
  return docs;
}

/**
 * Splits application process into clean readable steps or blocks.
 */
function parseApplicationProcess(raw: string | null): { title?: string; steps: string[] }[] {
  if (!raw) return [];

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const sections: { title?: string; steps: string[] }[] = [];
  let currentTitle: string | undefined = undefined;
  let currentSteps: string[] = [];

  for (const line of lines) {
    // Mode headers like [Online], [Offline], Registration of New Institute:
    const isHeader =
      /^\[(Online|Offline|Both)\]/i.test(line) ||
      (line.endsWith(":") && line.length < 50 && !/^step/i.test(line));

    if (isHeader) {
      if (currentSteps.length > 0 || currentTitle) {
        sections.push({ title: currentTitle, steps: currentSteps });
        currentSteps = [];
      }
      currentTitle = line.replace(/^[\[\(]|[\)\]]$/g, "").trim();
    } else {
      currentSteps.push(line);
    }
  }

  if (currentSteps.length > 0 || currentTitle) {
    sections.push({ title: currentTitle, steps: currentSteps });
  }

  return sections;
}

/**
 * Checks if a URL points to a document / PDF (guide) vs an application portal
 */
function isPdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return url.toLowerCase().includes(".pdf");
  }
}

// ─────────────────────────────────────────────────────────────────
// Detail Page Component
// ─────────────────────────────────────────────────────────────────
export default function SchemeDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const { openChat } = useChat();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    async function loadScheme() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getSchemeById(id);
        if (!isCancelled) {
          setScheme(res.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load scheme details.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadScheme();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-10 sm:py-14">
        <div className="page-container max-w-4xl animate-pulse">
          <div className="h-6 w-36 bg-surface-container rounded mb-8" />
          <div className="h-4 w-48 bg-surface-container rounded mb-3" />
          <div className="h-10 w-3/4 bg-surface-container rounded mb-6" />
          <div className="h-32 bg-surface-container-low rounded-2xl mb-8" />
          <div className="h-48 bg-surface-container-low rounded-2xl mb-8" />
          <div className="h-48 bg-surface-container-low rounded-2xl" />
        </div>
      </div>
    );
  }

  // Not Found / Error state
  if (error || !scheme) {
    return (
      <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-16">
        <div className="page-container max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container text-on-surface-variant mb-5">
            <span className="material-symbols-outlined text-[36px]">folder_off</span>
          </div>
          <h1 className="font-headline-sm text-headline-sm text-primary font-bold mb-3">
            Scheme Not Found
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
            {error || "We could not find the requested government scheme in our dataset."}
          </p>
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Schemes Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const docList = parseDocumentList(scheme.documentsRequired);
  const processSections = parseApplicationProcess(scheme.applicationProcess);

  // Structured eligibility rows (display only if data is present)
  const eligRows: { label: string; value: string }[] = [];
  const se = scheme.structuredEligibility;
  if (se) {
    if (se.minAge !== null || se.maxAge !== null) {
      const ageStr =
        se.minAge !== null && se.maxAge !== null
          ? `${se.minAge} to ${se.maxAge} years`
          : se.minAge !== null
          ? `Minimum ${se.minAge} years`
          : `Up to ${se.maxAge} years`;
      eligRows.push({ label: "Age Requirement", value: ageStr });
    }
    if (se.gender && se.gender !== "all") {
      eligRows.push({
        label: "Gender",
        value: se.gender.charAt(0).toUpperCase() + se.gender.slice(1) + " citizens",
      });
    }
    if (se.maxIncome !== null) {
      eligRows.push({
        label: "Income Ceiling",
        value: `Annual income up to ₹${se.maxIncome.toLocaleString("en-IN")}`,
      });
    }
    if (se.residence && se.residence !== "both") {
      eligRows.push({
        label: "Area of Residence",
        value: se.residence.charAt(0).toUpperCase() + se.residence.slice(1) + " areas only",
      });
    }
    if (se.state && se.state.length > 0) {
      eligRows.push({
        label: "Jurisdiction / State",
        value: se.state.join(", "),
      });
    }
    if (se.bpl) {
      eligRows.push({ label: "BPL Status", value: "BPL / Antyodaya Card Holder required" });
    }
    if (se.disability) {
      eligRows.push({ label: "Disability Category", value: "Person with Benchmark Disability (PwD)" });
    }
  }

  const hasAnyOfficialLink = Boolean(scheme.officialUrl || scheme.applyUrl);

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-8 sm:py-12 lg:py-14">
      <div className="page-container max-w-4xl">

        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span>Back to Schemes</span>
          </Link>
        </div>

        {/* Header section */}
        <header className="mb-10 pb-8 border-b border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
              {scheme.ministry || scheme.department || scheme.state}
            </span>
            <span className="text-outline">·</span>
            <span
              className={`font-label-sm text-[11px] px-2.5 py-0.5 rounded font-medium ${
                scheme.level === "central"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {scheme.level === "central" ? "Central Scheme" : `${scheme.state} State Scheme`}
            </span>
          </div>

          <h1 className="font-display text-display text-primary font-bold tracking-tight mb-4 leading-tight">
            {scheme.name}
          </h1>

          {/* Categories & Beneficiary badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {scheme.category.map((cat) => (
              <span
                key={cat}
                className="font-label-sm text-[12px] px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium"
              >
                {cat}
              </span>
            ))}
            {scheme.beneficiaryType.map((b) => (
              <span
                key={b}
                className="font-label-sm text-[12px] px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant/20 font-medium"
              >
                {b}
              </span>
            ))}
          </div>
        </header>

        {/* ── 1. Overview ── */}
        {scheme.description && (
          <section className="mb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="material-symbols-outlined text-secondary text-[22px]">info</span>
              <h2 className="font-title-md text-title-md text-primary font-bold">Overview</h2>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                {scheme.description}
              </p>
            </div>
          </section>
        )}

        {/* ── 2. Benefits ── */}
        {scheme.benefits && (
          <section className="mb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="material-symbols-outlined text-secondary text-[22px]">payments</span>
              <h2 className="font-title-md text-title-md text-primary font-bold">Benefits</h2>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line font-medium">
                {scheme.benefits}
              </p>
            </div>
          </section>
        )}

        {/* ── 3. Eligibility Requirements (INFORMATION ONLY) ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">rule</span>
              <h2 className="font-title-md text-title-md text-primary font-bold">
                Eligibility Requirements
              </h2>
            </div>
            <span className="font-label-sm text-[11px] px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-medium">
              Information Only
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-5">
            {/* Structured Criteria Rows */}
            {eligRows.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-outline-variant/15">
                {eligRows.map((row) => (
                  <div
                    key={row.label}
                    className="p-3.5 rounded-xl bg-surface border border-outline-variant/15 flex flex-col gap-1"
                  >
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      {row.label}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Free-text eligibility description from dataset */}
            {scheme.eligibilityText ? (
              <div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                  {scheme.eligibilityText}
                </p>
              </div>
            ) : eligRows.length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                Detailed eligibility criteria are not available in the available scheme data.
              </p>
            ) : null}

            {/* Informational banner reminding user eligibility is conversational via Ask Adhikaar */}
            <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                chat_bubble
              </span>
              <div className="flex-1">
                <span className="font-label-sm text-label-sm font-semibold text-primary block mb-0.5">
                  Need personalized advice on this scheme?
                </span>
                <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                  Discuss your family, occupation, and life circumstances with Ask Adhikaar to see
                  how these requirements apply to your situation.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openChat(
                      `I would like to check if I am eligible for "${scheme.name}". Can you help evaluate my circumstances?`
                    )
                  }
                  className="mt-3 px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold inline-flex items-center gap-1.5 hover:bg-opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  <span>Discuss in Ask Adhikaar</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Documents Required ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">description</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">
              Documents Required
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
            {docList.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docList.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-outline-variant/15"
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                      check_box
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface leading-snug">
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                Document requirements are not available in the available scheme data.
              </p>
            )}
          </div>
        </section>

        {/* ── 5. How to Apply ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">how_to_reg</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">How to Apply</h2>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
            {processSections.length > 0 ? (
              <div className="flex flex-col gap-6">
                {processSections.map((sec, secIdx) => (
                  <div key={secIdx} className="flex flex-col gap-3">
                    {sec.title && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container font-label-md text-label-md text-primary font-bold w-fit">
                        <span className="material-symbols-outlined text-[16px]">touch_app</span>
                        <span>{sec.title}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2.5">
                      {sec.steps.map((step, stepIdx) => {
                        const stepMatch = step.match(/^Step\s*(\d+)[:\.]?\s*(.*)$/i);
                        if (stepMatch) {
                          return (
                            <div
                              key={stepIdx}
                              className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/15"
                            >
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-label-sm text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {stepMatch[1]}
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                                {stepMatch[2]}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={stepIdx}
                            className="p-3 rounded-xl bg-surface border border-outline-variant/15"
                          >
                            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                Application instructions are not available in the available scheme data.
              </p>
            )}
          </div>
        </section>

        {/* ── 6. Official Sources & Application Links ── */}
        {hasAnyOfficialLink && (
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="material-symbols-outlined text-secondary text-[22px]">link</span>
              <h2 className="font-title-md text-title-md text-primary font-bold">
                Official Sources &amp; Portals
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
              {/* Official Information Portal */}
              {scheme.officialUrl && (
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-outline-variant/40 bg-surface text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    public
                  </span>
                  <span>Read Official Scheme Information</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    open_in_new
                  </span>
                </a>
              )}

              {/* Apply URL: guide (PDF) vs portal (web) */}
              {scheme.applyUrl && (
                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPdfUrl(scheme.applyUrl) ? "picture_as_pdf" : "launch"}
                  </span>
                  <span>
                    {isPdfUrl(scheme.applyUrl)
                      ? "View Official Application Guide"
                      : "Open Official Application Portal"}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Footer source attribution */}
        <footer className="pt-6 border-t border-outline-variant/20 text-center">
          <p className="font-label-sm text-label-sm text-outline">
            Data Source: {scheme.source?.name || "Indian Government Schemes Dataset"} · Official
            scheme terms and guidelines are subject to change by respective ministries.
          </p>
        </footer>

      </div>
    </div>
  );
}
