"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const urlError = searchParams.get("error");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(
    urlError === "AccessDeniedAdminOnly"
      ? "Administrator privileges are required to access that desk."
      : urlError || ""
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        setError(
          result.error === "INVALID_CREDENTIALS"
            ? "Invalid email address or password. Please try again."
            : result.error === "ACCOUNT_SUSPENDED"
            ? "Your account has been deactivated. Please contact support."
            : result.error === "PLEASE_LOGIN_WITH_GOOGLE"
            ? "This account was registered with Google. Please use Google Sign In."
            : result.error
        );
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected authentication error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Brand Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-third-color/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Premium Glassmorphic Form Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-purple-100/80 p-8 sm:p-10 relative z-10 transition-all">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-third-color font-extrabold text-3xl tracking-tight transform transition-transform hover:scale-105"
          >
            Comfort~Trip
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-third-color bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200/70 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-third-color" />
              Member Access
            </span>
          </div>
          <h2 className="text-2xl font-bold text-main-color mt-4 tracking-tight">
            Welcome back
          </h2>
          <p className="text-second-color text-xs mt-1">
            Sign in to view your bookings and reward points
          </p>
        </div>

        {/* Success Alert */}
        {registered && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account created! Please enter your password to sign in.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-main-color text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-third-color hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-main-color cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-third-color hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Authenticating..." : "Sign in to Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full border border-slate-200 bg-white hover:bg-purple-50/50 hover:border-purple-200 flex items-center justify-center py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm font-semibold text-main-color cursor-pointer disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-third-color" />
            ) : (
              <Image
                src="/Google.png"
                alt="Google"
                width={18}
                height={18}
                className="w-4 h-4 mr-2"
              />
            )}
            Sign in with Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-xs text-center text-second-color mt-6">
          Don’t have an account?{" "}
          <Link href="/Register" className="text-third-color hover:underline font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-third-color" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
