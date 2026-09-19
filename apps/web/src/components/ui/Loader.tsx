"use client";

import React from "react";

export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export interface LoaderProps extends Omit<React.SVGProps<SVGSVGElement>, "size"> {
  /**
   * Predefined size variant or explicit pixel number.
   * - "xs": 18px (Compact buttons, inline text badges)
   * - "sm": 24px (Chips, meta indicators, panel headers)
   * - "md": 48px (Standard card loading, AI assistant thinking)
   * - "lg": 96px (6em default, standard page/section loading)
   * - "xl": 144px (Fullscreen transitions, hero splashes)
   * @default "md"
   */
  size?: LoaderSize;
  /** Custom wrapper class for spacing and layout alignment */
  className?: string;
  /** Screen-reader label for accessibility */
  label?: string;
}

const SIZE_MAP: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
  xs: 18,
  sm: 24,
  md: 48,
  lg: 96,
  xl: 144,
};

/**
 * Adhikaar Standard Animated Ring Loader
 *
 * Preserves the exact 4-ring multi-hue keyframe geometry:
 * - Ring A: #f42f25 (Crimson Red)
 * - Ring B: #ffdd00 (Amber Yellow)
 * - Ring C: #255ff4 (Cobalt Blue)
 * - Ring D: #2cf425 (Emerald Green)
 */
export function Loader({
  size = "md",
  className = "",
  label = "Loading...",
  style,
  ...svgProps
}: LoaderProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize, ...style }}
    >
      <svg
        viewBox="0 0 240 240"
        width={pixelSize}
        height={pixelSize}
        className="pl"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
        focusable="false"
        {...svgProps}
      >
        <circle
          strokeLinecap="round"
          strokeDashoffset={-330}
          strokeDasharray="0 660"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={105}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--a"
        />
        <circle
          strokeLinecap="round"
          strokeDashoffset={-110}
          strokeDasharray="0 220"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={35}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--b"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={85}
          className="pl__ring pl__ring--c"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={155}
          className="pl__ring pl__ring--d"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Standard Full-Section / Page Loading Screen
 */
export function LoadingScreen({
  message = "Loading Adhikaar...",
  className = "",
  size = "lg",
}: {
  message?: string;
  className?: string;
  size?: LoaderSize;
}) {
  return (
    <div
      className={`min-h-[50vh] flex flex-col items-center justify-center gap-5 p-8 text-center ${className}`}
      role="status"
    >
      <Loader size={size} label={message} />
      {message && (
        <p className="font-label-md text-label-md text-on-surface-variant font-medium tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}

export default Loader;
