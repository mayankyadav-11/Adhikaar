export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];
export const DEFAULT_LOCALE: LocaleCode = "en";
