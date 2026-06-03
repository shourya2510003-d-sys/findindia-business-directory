"use client";

import {
  createContext,
  useState,
  useEffect,
} from "react";

import { en } from "@/locales/en";
import { hi } from "@/locales/hi";

export const LanguageContext =
  createContext<any>(null);

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    const saved =
      (localStorage.getItem("lang") as "en" | "hi") ||
      "en";

    setLang(saved);

    const listener = (event: any) => {
      setLang(event.detail);
    };

    window.addEventListener(
      "languageChange",
      listener
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        listener
      );
    };
  }, []);

  const translations =
    lang === "hi" ? hi : en;

  const t = (key: string) => {
    return (
      translations[
        key as keyof typeof translations
      ] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        setLanguage: (
          newLang: "en" | "hi"
        ) => {
          localStorage.setItem(
            "lang",
            newLang
          );
          setLang(newLang);
        },
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}