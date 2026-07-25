"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-fg-muted">
        <Sun className="w-4 h-4" />
        <span>Theme</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-bg rounded-lg border border-border transition-colors"
      title="Toggle Light/Dark Theme"
    >
      <div className="flex items-center gap-2">
        {isDark ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-warning" />}
        <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
      </div>
      <span className="text-[10px] uppercase font-bold text-fg-muted border border-border px-1.5 py-0.5 rounded">
        {isDark ? "ON" : "OFF"}
      </span>
    </button>
  );
}
