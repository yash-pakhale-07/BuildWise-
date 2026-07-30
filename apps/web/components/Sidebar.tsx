"use client";

import { Home, Search, Network, Radio, Rocket, BookOpen, Github, Bot, LayoutDashboard, Globe, Settings, Sparkles, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { CompactLanguageSwitcher } from "../lib/i18n/LanguageSwitcher";
import { useLanguage } from "../lib/i18n/LanguageProvider";
import { useAuth } from "../lib/auth/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const groups = [
    {
      groupKey: "groups.workspace",
      items: [
        { href: "/", labelKey: "sidebar.overview", icon: Home },
        { href: "/deepsearch", labelKey: "sidebar.deepsearch", icon: Search },
        { href: "/clustering", labelKey: "sidebar.clustering", icon: Network },
        { href: "/signals", labelKey: "sidebar.signals", icon: Radio },
      ],
    },
    {
      groupKey: "groups.planning",
      items: [
        { href: "/plan", labelKey: "sidebar.projecthub", icon: Rocket },
        { href: "/workspace", labelKey: "sidebar.workspace", icon: BookOpen },
      ],
    },
    {
      groupKey: "groups.execution",
      items: [
        { href: "/github", labelKey: "sidebar.github", icon: Github },
        { href: "/agent", labelKey: "sidebar.agent", icon: Bot },
      ],
    },
    {
      groupKey: "groups.account",
      items: [
        { href: "/dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard },
        { href: "/language", labelKey: "sidebar.language", icon: Globe },
        { href: "/settings", labelKey: "sidebar.settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-bg-subtle select-none">
      {/* Workspace Switcher Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-bold text-fg text-sm">
              <span>{t("app.title")}</span>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted" />
            </div>
            <span className="block text-[10px] text-accent font-semibold tracking-wider uppercase">
              {t("app.tagline")}
            </span>
          </div>
        </Link>
      </div>

      {/* Grouped Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.groupKey}>
            <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              {t(group.groupKey)}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ href, labelKey, icon: Icon }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                const labelText = t(labelKey);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-l-accent bg-card text-fg shadow-sm"
                        : "border-l-transparent text-fg-muted hover:bg-bg hover:text-fg"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-accent" : "text-fg-muted"} />
                    <span>{labelText}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="border-t border-border p-3 bg-card space-y-3">
        {user ? (
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary text-xs">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-fg truncate">{user.name}</p>
                <p className="text-[10px] text-fg-muted truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="p-1.5 rounded-lg text-fg-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pb-3 border-b border-border/50">
            <Link href="/login" className="text-xs font-bold text-primary hover:underline">Sign In</Link>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold text-fg-muted tracking-wider">
            {t("sidebar.language")}
          </span>
          <CompactLanguageSwitcher />
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
