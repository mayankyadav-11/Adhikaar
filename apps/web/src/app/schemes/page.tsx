"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useChat } from "@/contexts/ChatContext";
import { apiClient } from "@/services/apiClient";
import { Scheme, SchemeSearchFacets } from "@adhikaar/shared";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────────────────────────
// Static category labels
// ─────────────────────────────────────────────────────────────────
const STATIC_CATEGORIES = [
  { id: "all",         label: "All Sectors" },
  { id: "Agriculture", label: "Agriculture & Farmers" },
  { id: "Education",   label: "Students & Education" },
  { id: "Women",       label: "Women & Child Welfare" },
  { id: "Health",      label: "Healthcare" },
  { id: "Employment",  label: "Employment & MSME" },
  { id: "Social",      label: "Social Welfare" },
];

// ─────────────────────────────────────────────────────────────────
// SchemeCard
// ─────────────────────────────────────────────────────────────────
function SchemeCard({
  scheme,
  onAskAI,
}: {
  scheme: Scheme;
  onAskAI: (title: string) => void;
}) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all border border-outline-variant/20 flex flex-col justify-between">
      <div>
        {/* Header: Ministry/Department/State + Level Badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider line-clamp-2">
            {scheme.ministry || scheme.department || scheme.state}
          </span>
          <span
            className={`font-label-sm text-[11px] px-2.5 py-1 rounded shrink-0 font-medium ${
              scheme.level === "central"
                ? "bg-primary/10 text-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {scheme.level === "central" ? "Central" : scheme.state}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold leading-snug mb-1">
          <Link
            href={`/schemes/${encodeURIComponent(scheme.id)}`}
            className="hover:text-primary-container transition-colors"
          >
            {scheme.name}
          </Link>
        </h3>

        {/* Description */}
        {scheme.description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed line-clamp-3">
            {scheme.description}
          </p>
        )}

        {/* Benefits Preview */}
        {scheme.benefits && (
          <div className="my-4 p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/15">
            <div className="flex items-center gap-2 text-secondary font-bold font-title-md mb-1.5">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Benefits</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed line-clamp-4">
              {scheme.benefits}
            </p>
          </div>
        )}

        {/* Informational Eligibility Text */}
        {scheme.eligibilityText && (
          <div className="my-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold block mb-1">
              Eligibility:
            </span>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed line-clamp-3">
              {scheme.eligibilityText}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {scheme.category.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="font-label-sm text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant"
            >
              {cat}
            </span>
          ))}
          {scheme.level === "central" && (
            <span className="font-label-sm text-[11px] px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
              Pan-India
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/schemes/${encodeURIComponent(scheme.id)}`}
            className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <span>View Details</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
          <button
            type="button"
            onClick={() => onAskAI(scheme.name)}
            className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Ask Adhikaar</span>
            <span className="material-symbols-outlined text-[15px]">forum</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Schemes Page
// ─────────────────────────────────────────────────────────────────
export default function SchemesPage() {
  const { openChat } = useChat();

  // Search + filter state
  const [keyword, setKeyword]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState]     = useState("");
  const [selectedGender, setSelectedGender]   = useState<"all" | "female" | "male">("all");
  const [selectedIncome, setSelectedIncome]   = useState("any");
  const [disabilityFilter, setDisabilityFilter] = useState(false);
  const [bplFilter, setBplFilter]             = useState(false);
  const [studentFilter, setStudentFilter]     = useState(false);
  const [page, setPage]                       = useState(1);

  // Data state
  const [schemes, setSchemes]       = useState<Scheme[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [facets, setFacets]         = useState<SchemeSearchFacets>({ states: [], categories: [] });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const debouncedKeyword = useDebounce(keyword, 350);
  const filterChanged = useRef(false);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.searchSchemes({
        keyword:    debouncedKeyword || undefined,
        state:      selectedState || undefined,
        category:   selectedCategory !== "all" ? selectedCategory : undefined,
        gender:     selectedGender !== "all" ? selectedGender : undefined,
        income:     selectedIncome !== "any" ? Number(selectedIncome) : undefined,
        disability: disabilityFilter || undefined,
        bpl:        bplFilter || undefined,
        student:    studentFilter || undefined,
        page,
        limit: 12,
      });
      setSchemes(res.data.schemes);
      setPagination(res.data.pagination);
      setFacets(res.data.facets);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schemes.");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, selectedCategory, selectedState, selectedGender, selectedIncome, disabilityFilter, bplFilter, studentFilter, page]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    if (filterChanged.current) { setPage(1); filterChanged.current = false; }
  }, [debouncedKeyword, selectedCategory, selectedState, selectedGender, selectedIncome, disabilityFilter, bplFilter, studentFilter]);

  useEffect(() => { fetchSchemes(); }, [fetchSchemes]);

  function handleFilter(fn: () => void) { filterChanged.current = true; fn(); }

  function resetFilters() {
    filterChanged.current = true;
    setKeyword(""); setSelectedCategory("all"); setSelectedState("");
    setSelectedGender("all"); setSelectedIncome("any");
    setDisabilityFilter(false); setBplFilter(false); setStudentFilter(false);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="w-full bg-surface min-h-[calc(100vh-80px)] py-10 sm:py-14 lg:py-16">
      <div className="page-container">

        {/* Editorial Header */}
        <header className="flex flex-col items-start max-w-4xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container text-secondary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span className="font-label-sm text-label-sm tracking-wide uppercase font-semibold">
              Central &amp; State Welfare Directory
            </span>
          </div>
          <h1 className="font-display text-display text-primary tracking-tight mb-3 font-bold">
            Explore Government Schemes &amp; Citizen Benefits
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Search verified central and state social welfare, education, agriculture, healthcare,
            and financial schemes. Browse requirements, needed documents, and application steps.
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 text-on-surface-variant font-label-md text-label-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-semibold text-on-surface">
                {loading ? "Loading…" : `${pagination.total.toLocaleString("en-IN")} Schemes`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">dataset</span>
              <span>Verified Dataset</span>
            </div>
          </div>
        </header>

        {/* ── Search & Filter Panel ── */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 sm:p-8 mb-10 sm:mb-12 border border-outline-variant/20">
          {/* Search bar */}
          <div className="relative w-full mb-6">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[24px]">search</span>
              <input
                id="schemes-search-input"
                type="text"
                value={keyword}
                onChange={(e) => { filterChanged.current = true; setKeyword(e.target.value); }}
                placeholder="Search by keyword, scheme name, or life situation…"
                className="w-full h-14 pl-12 pr-28 rounded-xl bg-surface text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-all placeholder:text-outline border border-outline-variant/30"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => handleFilter(() => setKeyword(""))}
                  className="absolute right-3 px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Clear
                </button>
              )}
            </div>
            {/* Trending chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-on-surface-variant">
              <span className="font-label-sm text-label-sm mr-1 text-outline">Trending:</span>
              {["PM-KISAN", "Ayushman Bharat", "Mudra Loan", "Scholarship", "PMAY"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleFilter(() => setKeyword(tag))}
                  className="px-3 py-1 rounded-lg bg-surface text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors border border-outline-variant/20 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Category ribbon */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-primary font-bold">Beneficiary Group:</span>
              <button
                type="button"
                onClick={resetFilters}
                className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline"
              >
                Reset Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleFilter(() => setSelectedCategory(cat.id))}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
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

          {/* Filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-6 border-t border-outline-variant/20">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-state" className="font-label-sm text-label-sm text-on-surface-variant font-semibold">State / Jurisdiction</label>
              <select
                id="filter-state"
                value={selectedState}
                onChange={(e) => handleFilter(() => setSelectedState(e.target.value))}
                className="bg-surface text-on-surface font-body-sm text-body-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none"
              >
                <option value="">All States &amp; UTs</option>
                <option value="Central">Central (Pan-India)</option>
                {facets.states.filter((s) => s.toLowerCase() !== "central").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-gender" className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Gender</label>
              <select
                id="filter-gender"
                value={selectedGender}
                onChange={(e) => handleFilter(() => setSelectedGender(e.target.value as "all" | "female" | "male"))}
                className="bg-surface text-on-surface font-body-sm text-body-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none"
              >
                <option value="all">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-income" className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Income Ceiling</label>
              <select
                id="filter-income"
                value={selectedIncome}
                onChange={(e) => handleFilter(() => setSelectedIncome(e.target.value))}
                className="bg-surface text-on-surface font-body-sm text-body-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none"
              >
                <option value="any">Any Income</option>
                <option value="100000">Under ₹1,00,000</option>
                <option value="250000">Under ₹2,50,000</option>
                <option value="800000">Under ₹8,00,000</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Special Categories</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "f-disability", label: "Person with Disability", val: disabilityFilter, set: setDisabilityFilter },
                  { id: "f-bpl",        label: "BPL Card Holder",        val: bplFilter,        set: setBplFilter },
                  { id: "f-student",    label: "Student / Scholar",      val: studentFilter,    set: setStudentFilter },
                ].map(({ id, label, val, set }) => (
                  <label key={id} htmlFor={id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id={id} checked={val} onChange={(e) => handleFilter(() => set(e.target.checked))} className="w-4 h-4 accent-primary" />
                    <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-title-md text-title-md text-primary font-bold">
            {loading
              ? "Loading schemes…"
              : `Showing ${schemes.length} of ${pagination.total.toLocaleString("en-IN")} schemes`}
          </span>
          {pagination.totalPages > 1 && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl bg-error/10 border border-error/20 p-6 mb-8 text-error font-body-md flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Skeleton / Grid / Empty */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 animate-pulse">
                <div className="h-4 w-1/3 bg-surface-container rounded mb-3" />
                <div className="h-6 w-3/4 bg-surface-container rounded mb-4" />
                <div className="h-20 bg-surface-container rounded mb-4" />
                <div className="h-4 w-1/2 bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] mb-4 block text-outline">search_off</span>
            <p className="font-title-md text-title-md text-primary font-semibold mb-2">No schemes found</p>
            <p className="font-body-md text-body-md max-w-sm mx-auto">Try adjusting your search or filters.</p>
            <button type="button" onClick={resetFilters} className="mt-6 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onAskAI={(title) => openChat(`How do I apply for ${title} and what documents are required?`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pg =
                  pagination.totalPages <= 5 ? i + 1
                  : page <= 3 ? i + 1
                  : page >= pagination.totalPages - 2 ? pagination.totalPages - 4 + i
                  : page - 2 + i;
                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setPage(pg)}
                    className={`w-9 h-9 rounded-full font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                      pg === page ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              Next
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}

        {!loading && (
          <p className="text-center font-label-sm text-label-sm text-outline mt-10">
            Development dataset · Official scheme terms are subject to change by respective ministries.
          </p>
        )}
      </div>
    </div>
  );
}
