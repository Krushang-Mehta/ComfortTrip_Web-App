"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center text-purple-700">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <AdminLoginRedirect />
    </Suspense>
  );
}

function AdminLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";
    router.replace(`/Login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF8FD] flex flex-col items-center justify-center p-4">
      <div className="p-8 bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-500/5 text-center max-w-sm">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Redirecting to Secure Gateway</h2>
        <p className="text-xs text-slate-500 mt-1">
          Directing you to the unified Comfort~Trip authentication gateway...
        </p>
      </div>
    </div>
  );
}

