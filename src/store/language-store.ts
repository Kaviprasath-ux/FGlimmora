"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "te";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang: Lang) => set({ lang }),
    }),
    {
      name: "filmglimmora-lang",
    }
  )
);
