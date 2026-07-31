"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/auth/AuthContext";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    // Optionally return a loading spinner or null while checking auth
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-fg">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Prevent flashing protected content before redirect
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null; 
  }

  return <>{children}</>;
}
