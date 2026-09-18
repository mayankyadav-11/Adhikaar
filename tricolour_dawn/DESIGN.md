---
name: Tricolour Dawn
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#43474d'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#00152a'
  on-primary: '#ffffff'
  primary-container: '#102a43'
  on-primary-container: '#7a92b0'
  inverse-primary: '#b0c9e8'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#230f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#412000'
  on-tertiary-container: '#d5780b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  display-mobile:
    fontFamily: Source Serif 4
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system embodies a modern civic-tech vision: an intersection of dependable public constitutional service and high-clarity SaaS precision. The aesthetic is authoritative, dignified, yet deeply compassionate and radically accessible.

The emotional baseline is trust, institutional legitimacy, and clarity in moments of complexity. By pairing the scholarly, statutory dignity of an editorial serif with the pristine legibility of a modern sans-serif, the interface balances official gravitas with uncompromised human approachability. Visual weight stems from rich navy surfaces, warm ivory undertones, and purposeful patriotic accents that signal constitutional integrity without falling into administrative bureaucracy.

## Colors

The color palette is anchored by the deep sovereign depth of `#102A43` alongside civic national accents rooted in India's constitutional heritage. 

- **Primary (`#102A43`)**: Deep Sovereign Navy. Imparts absolute trust, structural authority, and stability. Utilized for institutional headers, primary buttons, high-contrast dark container surfaces, and critical UI anchors.
- **Secondary (`#0F766E`)**: Deep Judicial Teal. Represents constitutional calm, verified statuses, legal protection, and interactive tertiary actions.
- **Tertiary (`#FF9933`)**: Dawn Saffron. Applied with surgical discipline for key milestones, citizen action badges, active notifications, and urgent advisories.
- **Supportive Accents**: 
  - Indian Green (`#138808`) serves as the core semantic success state for approved schemes, resolved grievances, and verified documentation.
  - Saffron Gold (`#D4A017`) functions as a secondary highlight for landmark judgements, state seals, and institutional achievements.
- **Neutral & Canvas Surfaces**:
  - Primary Canvas: `#FFFDF7` (Warm Ivory) eliminates clinical blue light while maintaining high accessibility.
  - Secondary Canvas: `#F5F2EA` (Warm Cream Tint) creates natural depth for sidebars, inset cards, and nested metadata panels.
  - Border Substrate: `#E7E3D8` creates tactile separation without sharp delineation.
  - Text Hierarchy: Primary text relies on `#1F2937` (Slate Ink) for absolute readability; secondary text defaults to `#64748B` (Slate Grey).

## Typography

The typographic strategy pairs the statutory permanence of **Source Serif 4** with the engineered, geometric readability of **Manrope**.

- **Editorial Serifs (Source Serif 4)**: Strictly designated for section headings, hero claims, case names, and platform banners. It evokes judicial transcripts, official gazettes, and academic integrity.
- **Modern Sans-Serif (Manrope)**: Configured for all structural layouts, data tables, multilingual navigation, legal clauses, and interface inputs. Its tall x-height and open apertures guarantee legibility across script switches (Devanagari, Gurmukhi, Latin).
- **Multilingual Ratios**: Keep relative font sizing stable across Latin and Indic scripts. Ensure line-heights are uncompressed (`1.5` to `1.6` for body text) to provide room for ascenders, descenders, and vowel matras in Indian languages.

## Layout & Spacing

This design system uses a responsive 12-column grid system built on an 8pt architectural rhythm, calibrated for high information density without visual crowding.

- **Desktop (1024px and up)**: 12 columns with `1.5rem` (`24px`) gutters and max content boundary of `1280px` centered within a `3rem` (`48px`) outer margin.
- **Tablet (768px – 1023px)**: 8 columns with `1.25rem` (`20px`) gutters and `2rem` outer margins. Reflow two-column card grids into single vertical sequences.
- **Mobile (320px – 767px)**: 4 columns with `1rem` (`16px`) gutters and `1.25rem` (`20px`) canvas margins. Floating controls and primary action bars drop to bottom-fixed positions.
- **Rhythm Rules**: Group related legal meta-items using `space-xs` and `space-sm`. Use `space-md` for form fields and list rows, `space-lg` for card internal padding, and `space-xl` to `space-2xl` between distinct structural chapters.

## Elevation & Depth

Visual hierarchy rejects exaggerated drop shadows in favor of calm, physical document stacking and warm atmospheric depth.

- **Surface Tiers**:
  - **Level 0 (Base)**: `#FFFDF7` (Warm Ivory). Canvas background.
  - **Level 1 (Sub-layer)**: `#F5F2EA` (Warm Cream). Sidebars, informational trays, and document filters.
  - **Level 2 (Active Cards)**: Pure `#FFFFFF` resting on `#F5F2EA` with a subtle hairline stroke (`1px solid #E7E3D8`).
  - **Level 3 (Overlays & Dialogs)**: Pure `#FFFFFF` elevated above a backdrop blur scrim (`rgba(16, 42, 67, 0.4)`).
- **Shadow Profile**: Shadows use deep navy tinting rather than neutral black to preserve harmony with the `#102A43` primary tone:
  - *Resting Element*: `0 1px 3px rgba(16, 42, 67, 0.05), 0 1px 2px rgba(16, 42, 67, 0.03)`
  - *Hovered/Active Card*: `0 8px 24px -4px rgba(16, 42, 67, 0.08), 0 2px 6px -1px rgba(16, 42, 67, 0.04)`
  - *Modals & Drawers*: `0 20px 48px -12px rgba(16, 42, 67, 0.16)`
- **Structural Outlines**: All interactive surfaces carry a `1px` border using `#E7E3D8` to anchor edges against varied display calibrations.

## Shapes

The shape system leverages a refined, soft curvature (Scale `1`: `0.25rem` base) to project precision and structural balance.

- **Base Radius (`0.25rem` / `4px`)**: Text inputs, alert tags, table segments, and utility chips. Communicates architectural rigor.
- **Large Radius (`0.5rem` / `8px`)**: Interactive cards, civic scheme summary tiles, legal assistance briefs, and standard dialog containers.
- **Extra Large Radius (`0.75rem` / `12px`)**: Primary feature containers, hero announcement blocks, and elevated interactive panels.
- **Exceptions**: Status pips, language switcher toggles, and circular profile anchors utilize full pills (`9999px`) where touch affordance or discrete state selection demands complete containment.

## Components

### Top Navigation Bar
- **Architecture**: Rigid desktop height of `72px`, pinned at top with background blur (`backdrop-filter: blur(8px)`) over `#FFFDF7` at `95%` opacity, bordered by a bottom `1px solid #E7E3D8`.
- **Layout**: Left-aligned national logo and platform title; center-anchored navigational links (Home, Schemes, Legal Help, Resources, About); right-aligned controls.
- **Controls Zone**:
  - *Language Switcher*: Compact dropdown bordered with `#E7E3D8`, displaying local scripts (`English`, `हिंदी`, `ਪੰਜਾਬੀ`).
  - *Theme Toggle*: Minimal icon button housing sun/moon states in an understated `#1F2937` stroke.
  - *Authentication*: Secondary "Sign In" text link alongside a Primary "Sign Up" button.

### Buttons
- **Primary**: Background `#102A43`, text `#FFFFFF`, border-radius `0.25rem` (`4px`) or `0.5rem` (`8px`) depending on container scale. Hover state shifts to a lighter navy (`#1B3A57`).
- **Secondary**: Surface `#F5F2EA`, text `#102A43`, `1px solid #E7E3D8`. Hover state lightens to `#FFFDF7` with border `#102A43`.
- **Tertiary / Civic Action**: Dawn Saffron `#FF9933`, text `#102A43`, high-visibility CTA for emergency legal aid or urgent scheme submissions.

### Cards & Scheme Containers
- Pure white `#FFFFFF` surface placed over the warm cream canvas, delineated by a `1px solid #E7E3D8` stroke and an ambient navy shadow.
- Cards feature top tag placement (e.g., "Ministry Verified" or "Direct Benefit Transfer") accompanied by a serif title (`Source Serif 4`, `headline-sm`), key metadata lines, and clean bottom actions.

### Form Inputs & Selectors
- Height: `44px`. Background `#FFFFFF`, border `1px solid #E7E3D8`, text `#1F2937`.
- Focus State: Border shifts to `#102A43` with a subtle ring: `0 0 0 3px rgba(16, 42, 67, 0.12)`.
- Error State: Border shifts to deep crimson (`#B91C1C`) with accompanying helper text in `label-sm`.

### Status Chips & Badges
- Compact `24px` height, radius `0.25rem`.
- *Verified / Active*: Background `rgba(19, 136, 8, 0.10)`, text `#138808`.
- *Pending Review*: Background `rgba(212, 160, 23, 0.12)`, text `#92400E`.
- *Urgent Action*: Background `rgba(255, 153, 51, 0.15)`, text `#C2410C`.

### Specialized Civic Components
- **Legal Clause Callouts**: Left-bordered with a thick `4px` solid bar in `#0F766E`, background `#F5F2EA`, displaying statutory reference numbers in bold `label-sm`.
- **Bilingual Title Display**: Paired headline layouts supporting instantaneous switch between English legal phrasing and native regional translations without breaking vertical rhythm.