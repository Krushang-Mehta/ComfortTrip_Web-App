/**
 * Email template helper for branded Comfort Trip transactional emails
 */

const BRAND_NAME = 'Comfort Trip Car Rentals';
const BRAND_LOCATION = 'Rajkot, Gujarat';
const PRIMARY_COLOR = '#1e3a8a'; // Deep Navy / Primary
const ACCENT_COLOR = '#f59e0b'; // Amber / Gold

function baseLayout({ title, content, previewText }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0f172a 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #94a3b8; font-size: 14px; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .button { display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .info-box { background: #f8fafc; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px; border-radius: 6px; margin: 20px 0; }
    .highlight { color: ${ACCENT_COLOR}; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${BRAND_NAME}</h1>
      <p>Premium Cab & Chauffeur Services — ${BRAND_LOCATION}</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
      <p>Serving Rajkot, Ahmedabad, Jamnagar, Somnath, Dwarka & Saurashtra.</p>
      <p>Need urgent assistance? Call us 24/7 at +91 98790 00000.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Welcome customer email template
 */
export function welcomeEmailTemplate({ name, email }) {
  const content = `
    <h2>Welcome to Comfort Trip, ${name || 'Valued Customer'}!</h2>
    <p>Thank you for joining Rajkot's premier car rental and taxi booking service. We are committed to providing you with safe, clean, and reliable rides across Gujarat.</p>
    
    <div class="info-box">
      <h3 style="margin-top:0;">🎁 Welcome Bonus Unlocked</h3>
      <p>We've credited <span class="highlight">100 Reward Points</span> to your Comfort Trip wallet. You can redeem these points for instant discounts on your upcoming bookings!</p>
    </div>

    <p>Ready to plan your next journey? Browse our luxury sedans, comfortable SUVs, and tempo travellers with transparent per-km billing.</p>

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/Cars" class="button">Explore Vehicles & Book</a>
    </div>

    <p style="font-size: 13px; color: #64748b;">Account registered with: <strong>${email}</strong></p>
  `;

  return baseLayout({
    title: 'Welcome to Comfort Trip Car Rentals',
    content,
  });
}

/**
 * Booking confirmation email template
 */
export function bookingConfirmationEmailTemplate({ booking, user }) {
  const content = `
    <h2>Booking Confirmed! 🚗</h2>
    <p>Dear ${user?.name || 'Customer'}, your ride has been successfully booked with Comfort Trip.</p>

    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingId}</span></p>
      <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${booking.carModel || 'Vehicle'} (${booking.carCategory || 'Sedan'})</p>
      <p style="margin: 4px 0;"><strong>Trip Type:</strong> ${booking.tripType}</p>
      <p style="margin: 4px 0;"><strong>Pickup:</strong> ${booking.pickupLocation}</p>
      <p style="margin: 4px 0;"><strong>Drop-off:</strong> ${booking.dropLocation}</p>
      <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${new Date(booking.pickupDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p style="margin: 4px 0;"><strong>Total Estimated:</strong> ₹${booking.totalAmount?.toLocaleString('en-IN')}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> ${booking.status?.toUpperCase()}</p>
    </div>

    <p>Our fleet coordinator is preparing your vehicle. You will receive driver contact details as soon as the driver is dispatched.</p>

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" class="button">View Booking Details</a>
    </div>
  `;

  return baseLayout({
    title: `Booking Confirmation - ${booking.bookingId}`,
    content,
  });
}

/**
 * Driver assignment notification email template
 */
export function driverAssignedEmailTemplate({ booking, driver }) {
  const content = `
    <h2>Your Driver is Assigned! 👨‍✈️</h2>
    <p>Your driver for booking <strong>${booking.bookingId}</strong> has been assigned and will arrive at your pickup location on time.</p>

    <div class="info-box">
      <h3 style="margin-top:0;">Chauffeur & Vehicle Details</h3>
      <p style="margin: 4px 0;"><strong>Driver Name:</strong> ${driver.name}</p>
      <p style="margin: 4px 0;"><strong>Contact Number:</strong> <a href="tel:${driver.phone}">${driver.phone}</a></p>
      <p style="margin: 4px 0;"><strong>Vehicle Model:</strong> ${booking.carModel}</p>
      <p style="margin: 4px 0;"><strong>Vehicle Number Plate:</strong> ${booking.vehicleNumber || 'Confirmed with Driver'}</p>
    </div>

    <p>Feel free to call your driver directly for exact pickup coordination.</p>
  `;

  return baseLayout({
    title: `Driver Assigned - ${booking.bookingId}`,
    content,
  });
}

/**
 * Trip completed & review invite email template
 */
export function tripCompletedEmailTemplate({ booking, user, rewardPointsEarned = 5 }) {
  const content = `
    <h2>Trip Completed — Thank You!</h2>
    <p>Dear ${user?.name || 'Customer'}, thank you for riding with Comfort Trip Car Rentals on booking <strong>${booking.bookingId}</strong>.</p>

    <div class="info-box">
      <h3 style="margin-top:0;">🌟 Share Feedback & Earn +${rewardPointsEarned} Points</h3>
      <p>How was your chauffeur and vehicle experience? Submit a 1-minute review and receive an additional <strong>+${rewardPointsEarned} reward points</strong> credited instantly to your wallet!</p>
    </div>

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" class="button">Rate Your Ride & Download Invoice</a>
    </div>
  `;

  return baseLayout({
    title: `Trip Completed - ${booking.bookingId}`,
    content,
  });
}
