"use client";
import { useState, useEffect } from "react";

export default function ManageBookings() {
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

  // Function to update booking status
  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }), // Send updated status to API
    });

    // Update booking status locally without reloading
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b))
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.name} - {booking.status}
            {/* Buttons to update booking status */}
            <button onClick={() => updateStatus(booking._id, "Confirmed")}>
              Confirm
            </button>
            <button onClick={() => updateStatus(booking._id, "Completed")}>
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
