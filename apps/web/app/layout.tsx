import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "../components/Sidebar";

export const metadata = {
  title: "BuildWise — AI Research & Innovation Platform",
  description: "Transform raw project ideas into complete research-backed development plans. AI-powered IEEE literature analysis, architecture generation, and GitHub scaffolding.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-accent/20 selection:text-fg">
        <Providers>
          <div className="flex h-screen overflow-hidden bg-bg text-fg">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
