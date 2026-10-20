"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-purple-700">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(
    !token || !email
      ? "Invalid or missing password reset link. Please request a new recovery link."
      : ""
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both entries.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/Login");
        }, 2200);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Brand Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-purple-100/80 p-8 sm:p-10 relative z-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-purple-700 font-extrabold text-3xl tracking-tight transform transition-transform hover:scale-105 font-serif sm:font-sans"
          >
            Comfort~Trip
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200/70 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Secure Token Verification
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 tracking-tight">
            Create New Password
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Setting new password for: <strong className="text-purple-700">{email || "Account"}</strong>
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Password Updated Successfully!</p>
              <p className="text-emerald-700 mt-0.5">Redirecting you to the login page...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Reset Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (!error || token) ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter at least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset & Save Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center pt-2">
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition"
            >
              Request a New Recovery Link
            </Link>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/Login"
            className="text-xs text-slate-500 hover:text-purple-700 transition font-medium inline-flex items-center gap-1"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
