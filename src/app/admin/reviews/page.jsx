"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Eye,
  EyeOff,
  Coins,
  MessageSquare,
} from "lucide-react";

export default function AdminReviewsDesk() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        adminMode: "true",
        page: String(page),
        limit: "15",
      });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedRating) params.set("rating", selectedRating);

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (err) {
      console.error("[Fetch Reviews Error]", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedRating]);

  useEffect(() => {
    let ignore = false;
    async function sync() {
      try {
        const params = new URLSearchParams({
          adminMode: "true",
          page: String(page),
          limit: "15",
        });
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedRating) params.set("rating", selectedRating);

        const res = await fetch(`/api/reviews?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setReviews(data.reviews || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
        }
      } catch (err) {
        console.error("[Fetch Reviews Error]", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    sync();
    return () => {
      ignore = true;
    };
  }, [page, searchQuery, selectedRating]);

  async function handleTogglePublic(review) {
    const nextPublic = !review.isPublic;
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review._id, isPublic: nextPublic }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({
          type: "success",
          text: `Review visibility set to ${nextPublic ? "Public Testimonial" : "Hidden / Internal"}`,
        });
        fetchReviews();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to update review visibility" });
      }
    } catch (err) {
      console.error("[Toggle Review Error]", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {alertMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md ${
            alertMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          <span>{alertMessage.text}</span>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Customer Reviews & Testimonials</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Moderate verified customer ratings, chauffeur performance, and public website display
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
            {total} Verified Reviews
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRating("");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedRating === ""
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All Stars
            </button>
            {[5, 4, 3, 2, 1].map((stars) => {
              const active = selectedRating === String(stars);
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => {
                    setSelectedRating(String(stars));
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{stars}★</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by customer, booking ID..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Reviews Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs font-semibold">Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No customer reviews found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((r) => {
              return (
                <div
                  key={r._id}
                  className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  {/* Left: Customer info & comment */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                        {r.userName ? r.userName.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          {r.userName || "Verified Customer"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Booking: <strong className="text-purple-600">{r.bookingId}</strong> •{" "}
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Badges */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{r.overallRating} / 5</span>
                      </div>
                      {r.driverRating && (
                        <span className="text-[11px] text-slate-500">
                          Chauffeur: <strong className="text-slate-800">{r.driverRating}★</strong>
                        </span>
                      )}
                      {r.carCleanlinessRating && (
                        <span className="text-[11px] text-slate-500">
                          Cleanliness: <strong className="text-slate-800">{r.carCleanlinessRating}★</strong>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Coins className="w-3 h-3 text-emerald-600" />
                        <span>+5 Pts Credited</span>
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      &ldquo;{r.comments || "Great journey and smooth ride with Comfort~Trip!"}&rdquo;
                    </p>
                  </div>

                  {/* Right: Visibility Toggle Button */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePublic(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        r.isPublic
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300"
                      }`}
                    >
                      {r.isPublic ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Public Testimonial</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hidden / Internal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {pages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} reviews)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
