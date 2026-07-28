"use client";

import { createContext, useContext, useMemo } from "react";

type LanguageContextValue = { language: "en"; setLanguage: (_: "en" | "ar") => void; toggleLanguage: () => void; isArabic: false; };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<LanguageContextValue>(() => ({ language: "en", setLanguage: () => {}, toggleLanguage: () => {}, isArabic: false }), []);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const value = useContext(LanguageContext); if (!value) throw new Error("useLanguage must be used inside LanguageProvider"); return value; }
