"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { API_BASE_URL } from "../../lib/config";
import { useLanguage } from "../../lib/i18n/LanguageProvider";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok || res.status === 201) {
        setSuccess("Account created successfully. Redirecting to sign in...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (res.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-fg">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-fg-muted">
            Join BuildWise to start innovating
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-500 border border-green-500/20">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-accent" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-sm text-fg placeholder:text-fg-muted outline-none transition-all font-medium"
                placeholder="Jane Doe"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-sm text-fg placeholder:text-fg-muted outline-none transition-all font-medium"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-secondary" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-sm text-fg placeholder:text-fg-muted outline-none transition-all font-medium pr-10"
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-secondary" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-sm text-fg placeholder:text-fg-muted outline-none transition-all font-medium pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary/90 shadow-sm transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-fg-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
