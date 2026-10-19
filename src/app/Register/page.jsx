"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Gift,
  Loader2,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Live password criteria evaluations
  const pwd = formData.password;
  const passwordCriteria = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    special: /[!@#$%^&*()_\-+=]/.test(pwd),
    match: pwd && formData.confirmPassword && pwd === formData.confirmPassword,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Client-side pre-validation with explicit, sanitized guidance
    const clientErrors = {};

    if (!formData.firstName.trim()) {
      clientErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      clientErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      clientErrors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (formData.contact.trim() && !/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(formData.contact.trim())) {
      clientErrors.contact = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (formData.password.length < 8) {
      clientErrors.password = "Password must be at least 8 characters long.";
    } else if (!passwordCriteria.uppercase) {
      clientErrors.password = "Password must contain at least one uppercase letter (A-Z).";
    } else if (!passwordCriteria.lowercase) {
      clientErrors.password = "Password must contain at least one lowercase letter (a-z).";
    } else if (!passwordCriteria.number) {
      clientErrors.password = "Password must contain at least one number (0-9).";
    } else if (!passwordCriteria.special) {
      clientErrors.password = "Password must contain at least one special symbol (e.g. @, #, $, %).";
    }

    if (formData.password !== formData.confirmPassword) {
      clientErrors.confirmPassword = "Passwords do not match. Please re-type your password.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError(Object.values(clientErrors)[0]);
      return;
    }

    setLoading(true);

    try {
      const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: formData.email.trim().toLowerCase(),
          phone: formData.contact.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        throw new Error(data.message || "Failed to create account. Please check your inputs.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/Login?registered=true");
      }, 1500);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Brand Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-third-color/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Premium Glassmorphic Form Card */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-purple-100/80 p-8 sm:p-10 relative z-10 transition-all">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block text-third-color font-extrabold text-3xl tracking-tight transform transition-transform hover:scale-105"
          >
            Comfort~Trip
          </Link>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-third-color bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200/70 inline-flex items-center gap-1.5 shadow-sm shadow-purple-500/10">
              <Gift className="w-3.5 h-3.5 text-third-color" />
              100 Welcome Points Included
            </span>
          </div>
          <h2 className="text-2xl font-bold text-main-color mt-3 tracking-tight">
            Create an Account
          </h2>
          <p className="text-second-color text-xs mt-1">
            Join Rajkot’s most trusted cab and car rental service
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Account created successfully! Redirecting you to login...</span>
          </div>
        )}

        {/* Sanitized Main Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs leading-relaxed animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Please review your input:</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.firstName
                      ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                      : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                  }`}
                  required
                />
              </div>
              {fieldErrors.firstName && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.lastName
                      ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                      : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                  }`}
                  required
                />
              </div>
              {fieldErrors.lastName && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
              Contact Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.phone || fieldErrors.contact
                    ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                    : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                }`}
                required
              />
            </div>
            {(fieldErrors.phone || fieldErrors.contact) && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {fieldErrors.phone || fieldErrors.contact}
              </p>
            )}
          </div>

          {/* Email Address */}
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
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email
                    ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                    : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                }`}
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="e.g. Abcd@1234"
                  className={`w-full pl-9 pr-9 py-2 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                      : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-main-color cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-main-color text-xs font-semibold uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type password"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50/50 border rounded-xl text-main-color text-sm focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.confirmPassword
                      ? "border-rose-400 focus:ring-rose-200 bg-rose-50/30"
                      : "border-slate-200 focus:ring-third-color/30 focus:border-third-color"
                  }`}
                  required
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Interactive Password Requirements Helper */}
          {formData.password.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
              <span className="font-semibold text-slate-600 block mb-1">Password Requirements:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div className={`flex items-center gap-1 ${passwordCriteria.length ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.length ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordCriteria.uppercase ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.uppercase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>1 Uppercase (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordCriteria.lowercase ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.lowercase ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>1 Lowercase (a-z)</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordCriteria.number ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.number ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>1 Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordCriteria.special ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.special ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>1 Symbol (@, #, $, %)</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordCriteria.match ? "text-emerald-700" : "text-slate-400"}`}>
                  {passwordCriteria.match ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-3 bg-third-color hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating Account..." : "Create Account & Claim 100 Points"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-xs text-center text-second-color mt-6">
          Already have an account?{" "}
          <Link href="/Login" className="text-third-color hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
