import {
  Scheme,
  CitizenEligibilityCriteria,
} from "../types/scheme";

/**
 * Criterion-level eligibility result with human-readable labels.
 * Used to render per-criterion pass/fail rows in the UI.
 */
export interface CriterionResult {
  label: string;
  met: boolean;
  citizenValue: string;
  schemeValue: string;
  note?: string;
}

export interface DetailedEligibilityResult {
  isEligible: boolean;
  reasons: string[];
  evaluatedCriteriaCount: number;
  criteria: CriterionResult[];
}

/**
 * Pure eligibility evaluator — no I/O, no Node.js dependencies.
 * Safe to import in both the Express API (server) and Next.js (browser).
 *
 * Returns pass/fail per evaluated criterion so the UI can render a breakdown table.
 */
export function evaluateEligibility(
  scheme: Scheme,
  citizen: CitizenEligibilityCriteria
): DetailedEligibilityResult {
  const reasons: string[] = [];
  const criteria: CriterionResult[] = [];
  let evaluatedCount = 0;
  let isEligible = true;

  const elig = scheme.structuredEligibility;

  // ── Age ──────────────────────────────────────────────
  if (citizen.age !== undefined && citizen.age !== null) {
    evaluatedCount++;
    const hasMin = elig.minAge !== null;
    const hasMax = elig.maxAge !== null;
    const schemeRange =
      hasMin && hasMax
        ? `${elig.minAge}–${elig.maxAge} years`
        : hasMin
        ? `≥ ${elig.minAge} years`
        : hasMax
        ? `≤ ${elig.maxAge} years`
        : "Any age";

    let ageMet = true;
    let ageNote: string | undefined;

    if (hasMin && citizen.age < elig.minAge!) {
      ageMet = false;
      ageNote = `Minimum required age is ${elig.minAge}.`;
      isEligible = false;
      reasons.push(ageNote);
    }
    if (hasMax && citizen.age > elig.maxAge!) {
      ageMet = false;
      ageNote = `Maximum eligible age is ${elig.maxAge}.`;
      isEligible = false;
      reasons.push(ageNote);
    }

    criteria.push({
      label: "Age",
      met: ageMet,
      citizenValue: `${citizen.age} years`,
      schemeValue: schemeRange,
      note: ageNote,
    });
  }

  // ── Gender ───────────────────────────────────────────
  if (citizen.gender) {
    evaluatedCount++;
    const g = citizen.gender.trim().toLowerCase();
    const schemeGender =
      elig.gender === "all" ? "All genders" : elig.gender === "female" ? "Female only" : "Male only";
    const genderMet = elig.gender === "all" || elig.gender === g;
    if (!genderMet) {
      isEligible = false;
      const note = `Scheme is designated for ${elig.gender} beneficiaries.`;
      reasons.push(note);
      criteria.push({
        label: "Gender",
        met: false,
        citizenValue: citizen.gender,
        schemeValue: schemeGender,
        note,
      });
    } else {
      criteria.push({
        label: "Gender",
        met: true,
        citizenValue: citizen.gender,
        schemeValue: schemeGender,
      });
    }
  }

  // ── Income ───────────────────────────────────────────
  if (citizen.income !== undefined && citizen.income !== null) {
    evaluatedCount++;
    const hasIncomeCap = elig.maxIncome !== null;
    const schemeIncome = hasIncomeCap
      ? `≤ ₹${elig.maxIncome!.toLocaleString("en-IN")}`
      : "No income limit";
    const incomeMet = !hasIncomeCap || citizen.income <= elig.maxIncome!;

    if (!incomeMet) {
      const note = `Annual income exceeds eligible ceiling of ₹${elig.maxIncome!.toLocaleString("en-IN")}.`;
      isEligible = false;
      reasons.push(note);
      criteria.push({
        label: "Annual Income",
        met: false,
        citizenValue: `₹${citizen.income.toLocaleString("en-IN")}`,
        schemeValue: schemeIncome,
        note,
      });
    } else {
      criteria.push({
        label: "Annual Income",
        met: true,
        citizenValue: `₹${citizen.income.toLocaleString("en-IN")}`,
        schemeValue: schemeIncome,
      });
    }
  }

  // ── State ────────────────────────────────────────────
  if (citizen.state) {
    evaluatedCount++;
    const target = citizen.state.trim().toLowerCase();
    const isCentral = scheme.level === "central" || scheme.state.toLowerCase() === "central";
    const matchesState =
      scheme.state.toLowerCase() === target ||
      elig.state.some((s: string) => s.toLowerCase() === target);

    const schemeState = isCentral ? "All states (Pan-India)" : scheme.state;
    const stateMet = isCentral || matchesState;

    if (!stateMet) {
      const note = `Scheme is valid for residents of ${scheme.state}.`;
      isEligible = false;
      reasons.push(note);
      criteria.push({
        label: "State",
        met: false,
        citizenValue: citizen.state,
        schemeValue: schemeState,
        note,
      });
    } else {
      criteria.push({
        label: "State",
        met: true,
        citizenValue: citizen.state,
        schemeValue: schemeState,
      });
    }
  }

  // ── Disability ───────────────────────────────────────
  if (citizen.disability !== undefined && citizen.disability !== null) {
    if (elig.disability) {
      evaluatedCount++;
      const disabilityMet = citizen.disability;
      if (!disabilityMet) {
        const note = "Scheme requires recognized benchmark disability verification.";
        isEligible = false;
        reasons.push(note);
        criteria.push({
          label: "Disability",
          met: false,
          citizenValue: "No",
          schemeValue: "Required",
          note,
        });
      } else {
        criteria.push({
          label: "Disability",
          met: true,
          citizenValue: "Yes",
          schemeValue: "Required",
        });
      }
    }
  }

  // ── BPL ──────────────────────────────────────────────
  if (citizen.bpl !== undefined && citizen.bpl !== null) {
    if (elig.bpl) {
      evaluatedCount++;
      const bplMet = citizen.bpl;
      if (!bplMet) {
        const note = "Scheme requires Below Poverty Line (BPL) / Antyodaya ration card.";
        isEligible = false;
        reasons.push(note);
        criteria.push({
          label: "BPL Status",
          met: false,
          citizenValue: "No",
          schemeValue: "Required",
          note,
        });
      } else {
        criteria.push({
          label: "BPL Status",
          met: true,
          citizenValue: "Yes",
          schemeValue: "Required",
        });
      }
    }
  }

  return {
    isEligible,
    reasons,
    evaluatedCriteriaCount: evaluatedCount,
    criteria,
  };
}
