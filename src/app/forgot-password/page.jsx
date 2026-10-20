"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(
          "If your email is registered with Comfort~Trip, a secure password reset link has been dispatched. The reset link is valid for 30 minutes."
        );
      } else {
        setErrorMsg(data.message || "Failed to process request. Please try again.");
      }
    } catch (err) {
      setErrorMsg("A network error occurred. Please verify your connection and try again.");
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
              <KeyRound className="w-3 h-3 text-purple-600" />
              Account Recovery
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Enter your registered email address. We will send a secure link with a 30-minute validity window.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900">Email Dispatched</p>
              <p className="text-emerald-700 leading-relaxed">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        {!successMsg ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100 transition"
                />
              </div>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Reset links expire automatically in 30 minutes for security.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center pt-2">
            <Link
              href="/Login"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 transition"
            >
              Return to Login
            </Link>
          </div>
        )}

        {/* Footer Back link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/Login"
            className="text-xs text-slate-500 hover:text-purple-700 transition font-medium inline-flex items-center gap-1"
          >
            ← Remember your password? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
