/**
 * Shared validation utilities for Adhikaar
 */

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

export function isValidPort(val: unknown): boolean {
  const port = Number(val);
  return Number.isInteger(port) && port > 0 && port <= 65535;
}
