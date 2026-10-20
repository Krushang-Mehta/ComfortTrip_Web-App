"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Welcome & Suggested Vehicle Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/60 shadow-sm h-64 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-8 bg-purple-100/70 rounded-xl w-2/3" />
            <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-purple-200/70 rounded-xl w-36" />
            <div className="h-10 bg-slate-100 rounded-xl w-32" />
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-purple-100/60 shadow-sm h-64 flex flex-col justify-between">
          <div className="h-32 bg-slate-100 rounded-2xl w-full" />
          <div className="space-y-2 mt-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="h-8 bg-purple-50 rounded-xl w-full mt-2" />
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-purple-100/60 shadow-sm h-36 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-purple-100/60 rounded-2xl" />
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded w-20" />
              <div className="h-6 bg-slate-200 rounded w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Categories Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100/60 shadow-sm h-80 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="h-5 bg-slate-200 rounded w-36" />
            <div className="h-6 bg-purple-50 rounded-xl w-24" />
          </div>
          <div className="h-48 bg-slate-50 rounded-2xl w-full flex items-end justify-between p-4 gap-3">
            {[40, 55, 65, 75, 85, 95].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="flex-1 bg-purple-200/70 rounded-t-xl"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-purple-100/60 shadow-sm h-80 flex flex-col items-center justify-between">
          <div className="w-full h-5 bg-slate-200 rounded" />
          <div className="w-36 h-36 rounded-full border-8 border-purple-100 flex items-center justify-center">
            <div className="w-16 h-4 bg-purple-200 rounded" />
          </div>
          <div className="w-full space-y-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl border border-purple-100/70 p-4 shadow-sm flex flex-col justify-between h-96">
          <div className="w-full h-48 rounded-2xl bg-slate-100" />
          <div className="space-y-3 pt-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-5 bg-purple-100 rounded w-16" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 bg-slate-100 rounded w-16" />
              <div className="h-4 bg-slate-100 rounded w-16" />
              <div className="h-4 bg-slate-100 rounded w-16" />
            </div>
            <div className="h-10 bg-purple-50 border border-purple-200/60 rounded-xl w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100/70 p-4 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="h-5 bg-slate-200 rounded w-40" />
        <div className="h-8 bg-slate-100 rounded-xl w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100/70 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-32" />
                <div className="h-2.5 bg-slate-100 rounded w-20" />
              </div>
            </div>
            <div className="hidden sm:block h-3.5 bg-slate-100 rounded w-28" />
            <div className="h-5 bg-purple-100 rounded-full w-20" />
            <div className="h-7 bg-slate-200 rounded-lg w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
