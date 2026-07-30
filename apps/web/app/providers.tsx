"use client";

import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../lib/i18n/LanguageProvider";
import { AuthProvider } from "../lib/auth/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
