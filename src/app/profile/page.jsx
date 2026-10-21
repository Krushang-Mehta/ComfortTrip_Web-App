"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Coins,
  Calendar,
  MapPin,
  Car,
  Download,
  Star,
  Clock,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  FileText,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Gift,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  // Redirect unauthenticated visitors
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login?callbackUrl=/profile");
    }
  }, [status, router]);

  // Load User Bookings with React 19 safe async effect
  useEffect(() => {
    let isCancelled = false;
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!isCancelled && data.success) {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Failed to load user bookings", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    if (session?.user) {
      fetchBookings();
    }
    return () => {
      isCancelled = true;
    };
  }, [session]);

  const reloadBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to reload user bookings", err);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewRating(5);
    setReviewComment("");
    setReviewError("");
    setReviewSuccess("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setSubmittingReview(true);
    setReviewError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingForReview.bookingId || selectedBookingForReview._id,
          overallRating: Number(reviewRating),
          comments: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviewSuccess("Review submitted! +5 points credited to your wallet.");
      // Refresh session points and bookings
      await update();
      await reloadBookings();

      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewSuccess("");
      }, 1500);
    } catch (err) {
      setReviewError(err.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Dynamic Reward Points Ledger Calculation
  const pointsLedger = React.useMemo(() => {
    const list = [
      {
        id: "signup_bonus",
        date: session?.user?.createdAt || "2026-10-01",
        title: "Welcome Bonus",
        description: "Welcome credit for joining Comfort~Trip",
        points: 100,
        type: "credit",
      },
    ];

    bookings.forEach((b) => {
      // 1 pt per ₹100 of completed booking
      if (b.status === "Completed") {
        const earned = Math.max(1, Math.floor((b.totalEstimatedAmount || 0) / 100));
        list.push({
          id: `ride_${b._id}`,
          date: b.pickupDateTime || b.createdAt,
          title: `Ride Completion Reward (#${b.bookingId})`,
          description: `₹${(b.totalEstimatedAmount || 0).toLocaleString()} fare completed`,
          points: earned,
          type: "credit",
        });
      }
      // Points redeemed
      if (b.redeemedPoints && b.redeemedPoints > 0) {
        list.push({
          id: `redeemed_${b._id}`,
          date: b.createdAt,
          title: `Discount Redeemed (#${b.bookingId})`,
          description: `Fare reduction coupon discount applied`,
          points: -b.redeemedPoints,
          type: "debit",
        });
      }
    });

    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bookings, session]);

  const totalEarnedPoints = pointsLedger
    .filter((p) => p.points > 0)
    .reduce((sum, p) => sum + p.points, 0);

  const totalRedeemedPoints = Math.abs(
    pointsLedger
      .filter((p) => p.points < 0)
      .reduce((sum, p) => sum + p.points, 0)
  );

  const calculatedBalance = Math.max(0, totalEarnedPoints - totalRedeemedPoints);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "active") {
      return ["Pending", "Confirmed", "Driver-Assigned", "In-Journey"].includes(b.status);
    }
    if (activeTab === "completed") {
      return ["Completed", "Cancelled"].includes(b.status);
    }
    return true;
  });

  const getStatusBadge = (bStatus) => {
    const config = {
      Pending: "bg-amber-50 text-amber-800 border-amber-200",
      Confirmed: "bg-blue-50 text-blue-800 border-blue-200",
      "Driver-Assigned": "bg-purple-50 text-purple-800 border-purple-200",
      "In-Journey": "bg-indigo-50 text-indigo-800 border-indigo-200",
      Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
      Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
    };
    return (
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
          config[bStatus] || "bg-slate-100 text-slate-700 border-slate-200"
        }`}
      >
        {bStatus}
      </span>
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-third-color" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Customer Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100/70 text-third-color flex items-center justify-center font-bold text-2xl border border-purple-200/60 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-main-color">{user?.name}</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-third-color bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {user?.role === "super-admin"
                    ? "Super Admin"
                    : user?.role === "admin"
                    ? "Administrator"
                    : "Verified Customer"}
                </span>
              </div>
              <p className="text-xs text-second-color mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Reward Wallet Points Box */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200/80 rounded-2xl p-4 sm:px-6 flex items-center justify-between sm:justify-start gap-4 shadow-sm shadow-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-third-color text-white flex items-center justify-center shadow-md shadow-purple-500/30">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Reward Wallet Balance
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-third-color">
                  {calculatedBalance}
                </span>
                <span className="text-xs font-bold text-slate-400">pts (₹{calculatedBalance})</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Earn 1 pt / ₹100 ride fare • 1 pt = ₹1 discount
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Reward Points Activity Ledger */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-main-color">Points Ledger & Transactions</h2>
              </div>
              <p className="text-xs text-second-color mt-0.5">
                Transparent audit trail of your earned bonuses and booking redemptions
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Earned: +{totalEarnedPoints} pts</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Redeemed: -{totalRedeemedPoints} pts</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {pointsLedger.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      item.type === "credit"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}
                  >
                    {item.type === "credit" ? (
                      <Gift className="w-4 h-4" />
                    ) : (
                      <Coins className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                      item.type === "credit"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trips & Bookings Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-main-color">My Trips & Bookings</h2>
              <p className="text-xs text-second-color mt-0.5">
                Track live journey status and download official tax receipts
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: "all", label: "All Bookings" },
                { id: "active", label: "Active Trips" },
                { id: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-third-color shadow-sm"
                      : "text-slate-600 hover:text-main-color"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-third-color" />
              <p className="text-sm">Loading your journey history...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-main-color">No trips found</h3>
              <p className="text-xs text-second-color mt-1">
                You haven&apos;t placed any bookings in this view yet. Ready to travel?
              </p>
              <Link
                href="/Bookings"
                className="mt-5 inline-block bg-third-color hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-md shadow-purple-500/20 transition-all"
              >
                Book Your First Ride
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-purple-200 bg-white transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-third-color">
                        {b.bookingId}
                      </span>
                      {getStatusBadge(b.status)}
                      <span className="text-xs text-slate-400 font-medium">{b.tripType}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Download PDF Tax Invoice */}
                      <a
                        href={`/api/bookings/${b.bookingId}/invoice`}
                        download={`${b.bookingId}.pdf`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-third-color border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Download GST Compliant Tax Invoice"
                      >
                        <Download className="w-3.5 h-3.5 text-third-color" />
                        <span>Download Invoice (PDF)</span>
                      </a>

                      {/* Review Button for completed trips */}
                      {b.status === "Completed" && (
                        b.reviewSubmitted ? (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Reviewed (+5 pts)</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(b)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-third-color hover:bg-purple-700 px-3 py-1.5 rounded-lg shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Review (+5 pts)</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Route & Vehicle Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                    <div>
                      <p className="text-slate-400">Route</p>
                      <p className="font-semibold text-main-color mt-0.5">
                        {b.pickupAddress} &rarr; {b.destinationAddress}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Pickup Date & Time</p>
                      <p className="font-semibold text-main-color mt-0.5">
                        {new Date(b.pickupDateTime).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Estimated Total</p>
                      <p className="font-bold text-base text-third-color mt-0.5">
                        ₹{b.totalEstimatedAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Chauffeur Details (if assigned) */}
                  {b.assignedDriver?.name && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-third-color" />
                        <span className="text-slate-600">
                          Chauffeur: <strong>{b.assignedDriver.name}</strong>
                        </span>
                        {b.assignedDriver.licenseNumber && (
                          <span className="text-slate-400">({b.assignedDriver.licenseNumber})</span>
                        )}
                      </div>
                      {b.assignedDriver.phone && (
                        <a
                          href={`tel:${b.assignedDriver.phone}`}
                          className="text-third-color font-semibold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{b.assignedDriver.phone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post-Trip Ride Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-purple-50 text-third-color rounded-2xl flex items-center justify-center mx-auto mb-2 border border-purple-200">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-main-color">Rate Your Ride</h3>
              <p className="text-xs text-second-color mt-1">
                Booking Reference: <strong className="text-third-color">{selectedBookingForReview?.bookingId}</strong>
              </p>
              <div className="inline-flex items-center gap-1 mt-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Earn +5 Reward Points for your review</span>
              </div>
            </div>

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{reviewSuccess}</span>
              </div>
            )}

            {reviewError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{reviewError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Selector */}
              <div className="text-center">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-semibold text-main-color uppercase tracking-wider mb-1.5">
                  Your Comments (Optional)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="How was your chauffeur and vehicle experience?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview || !!reviewSuccess}
                  className="bg-third-color hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/25 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {submittingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit & Claim +5 Points</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
