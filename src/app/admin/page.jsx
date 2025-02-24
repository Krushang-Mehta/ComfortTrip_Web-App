"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings when the component mounts
  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/bookings"); // Fetch bookings from API
      const data = await res.json();
      setBookings(data); // Store fetched bookings in state
    }
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      {/* Button to navigate to Manage Bookings page */}
      <button onClick={() => router.push("/admin/manageBookings")}>
        Manage Bookings
      </button>

      {/* Display list of bookings */}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>{booking.name} - {booking.status}</li>
        ))}
      </ul>
    </div>
  );
}
