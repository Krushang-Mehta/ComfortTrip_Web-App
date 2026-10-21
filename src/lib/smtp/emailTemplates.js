/**
 * Email template helper for branded Comfort Trip transactional emails
 * Fully responsive across all devices and inboxes (desktop, tablet, mobile).
 * Uses inline vector SVG Lucide icons instead of emojis.
 * Dynamically resolves base URL via multi-tier resolution engine (Approach C).
 */

import { resolveBaseUrl } from '@/lib/utils/url';

const BRAND_NAME = 'Comfort Trip Car Rentals';
const BRAND_LOCATION = 'Rajkot, Gujarat';
const PRIMARY_COLOR = '#1e3a8a'; // Deep Navy / Primary
const ACCENT_COLOR = '#f59e0b'; // Amber / Gold

/**
 * Clean Lucide SVG icon paths for email inboxes
 */
function getLucideSvg(iconName, { size = 18, color = 'currentColor' } = {}) {
  const icons = {
    car: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
    gift: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
    userCheck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
    checkCircle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    clipboardCheck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
    alertCircle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    alertTriangle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    flag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    fileText: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    keyRound: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="${color}"/></svg>`,
    clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    shieldCheck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`
  };
  return icons[iconName] || '';
}

/**
 * Renders an inline Lucide icon inside a circular/rounded badge container
 */
function lucideBadge(iconName, color = '#7c3aed', bgColor = '#f5f3ff', size = 18) {
  const containerSize = size + 10;
  return `<span style="display: inline-block; vertical-align: middle; text-align: center; width: ${containerSize}px; height: ${containerSize}px; line-height: ${containerSize}px; border-radius: 8px; background-color: ${bgColor}; margin-right: 8px;">${getLucideSvg(iconName, { size, color })}</span>`;
}

function baseLayout({ title, content, previewText }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 0; width: 100% !important; min-width: 100%; }
    .wrapper-table { width: 100%; background-color: #f1f5f9; padding: 28px 12px; }
    .container-box { max-width: 600px; width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0f172a 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
    .button { display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 18px 0; }
    .footer { background-color: #f8fafc; padding: 24px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .info-box { background: #f8fafc; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px 20px; border-radius: 8px; margin: 20px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
    .highlight { color: ${ACCENT_COLOR}; font-weight: 700; }
    
    @media only screen and (max-width: 600px) {
      .wrapper-table { padding: 12px 8px !important; }
      .container-box { width: 100% !important; border-radius: 12px !important; }
      .header { padding: 24px 18px !important; }
      .header h1 { font-size: 20px !important; }
      .content { padding: 22px 16px !important; }
      .footer { padding: 20px 14px !important; }
      .button { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="wrapper-table" width="100%">
    <tr>
      <td align="center">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <div class="container-box">
          <div class="header">
            <h1>${BRAND_NAME}</h1>
            <p>Premium Cab & Chauffeur Services &mdash; ${BRAND_LOCATION}</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
            <p style="margin: 0 0 6px 0;">Serving Rajkot, Ahmedabad, Jamnagar, Somnath, Dwarka & Saurashtra.</p>
            <p style="margin: 0;">Need urgent assistance? Call us 24/7 at +91 98790 00000.</p>
          </div>
        </div>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Welcome customer email template
 */
export function welcomeEmailTemplate({ name, email, siteUrl = resolveBaseUrl() }) {
  const content = `
    <h2>Welcome to Comfort Trip, ${name || 'Valued Customer'}!</h2>
    <p>Thank you for joining Rajkot's premier car rental and taxi booking service. We are committed to providing you with safe, clean, and reliable rides across Gujarat.</p>
    
    <div class="info-box">
      <h3 style="margin-top:0;">${lucideBadge('gift', '#f59e0b', '#fef3c7', 16)} Welcome Bonus Unlocked</h3>
      <p>We've credited <span class="highlight">100 Reward Points</span> to your Comfort Trip wallet. You can redeem these points for instant discounts on your upcoming bookings!</p>
    </div>

    <p>Ready to plan your next journey? Browse our luxury sedans, comfortable SUVs, and tempo travellers with transparent per-km billing.</p>

    <div style="text-align: center;">
      <a href="${siteUrl}/Cars" class="button">Explore Vehicles & Book</a>
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
export function bookingConfirmationEmailTemplate({ booking, user, siteUrl = resolveBaseUrl() }) {
  const content = `
    <h2>${lucideBadge('checkCircle', '#10b981', '#ecfdf5', 20)} Booking Confirmed!</h2>
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
      <a href="${siteUrl}/profile" class="button">View Booking Details</a>
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
export function driverAssignedEmailTemplate({ booking, driver, siteUrl = resolveBaseUrl() }) {
  const content = `
    <h2>${lucideBadge('userCheck', '#7c3aed', '#f5f3ff', 20)} Your Driver is Assigned!</h2>
    <p>Your driver for booking <strong>${booking.bookingId}</strong> has been assigned and will arrive at your pickup location on time.</p>

    <div class="info-box">
      <h3 style="margin-top:0;">Chauffeur & Vehicle Details</h3>
      <p style="margin: 4px 0;"><strong>Driver Name:</strong> ${driver.name}</p>
      <p style="margin: 4px 0;"><strong>Contact Number:</strong> <a href="tel:${driver.phone}">${driver.phone}</a></p>
      <p style="margin: 4px 0;"><strong>Vehicle Model:</strong> ${booking.carModel}</p>
      <p style="margin: 4px 0;"><strong>Vehicle Number Plate:</strong> ${booking.vehicleNumber || 'Confirmed with Driver'}</p>
    </div>

    <p>Feel free to call your driver directly for exact pickup coordination.</p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${siteUrl}/profile" class="button">Track Ride Status</a>
    </div>
  `;

  return baseLayout({
    title: `Driver Assigned - ${booking.bookingId}`,
    content,
  });
}

/**
 * User booking inquiry acknowledgement email template
 */
export function bookingRequestUserEmailTemplate({ booking, user, siteUrl = resolveBaseUrl() }) {
  const amount = booking.totalEstimatedAmount || booking.totalAmount || 0;
  const content = `
    <h2>${lucideBadge('clipboardCheck', '#1e3a8a', '#eff6ff', 20)} Booking Request Received</h2>
    <p>Dear ${user?.name || 'Valued Customer'},</p>
    <p>Thank you for submitting your ride request with <strong>Comfort Trip Car Rentals</strong>. Our live dispatch desk has received your details and is preparing vehicle confirmation.</p>

    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingId}</span></p>
      <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${booking.carModel || 'Selected Vehicle'} (${booking.carCategory || 'Standard'})</p>
      <p style="margin: 4px 0;"><strong>Trip Type:</strong> ${booking.tripType}</p>
      <p style="margin: 4px 0;"><strong>Pickup:</strong> ${booking.pickupAddress || booking.pickupLocation}</p>
      <p style="margin: 4px 0;"><strong>Drop-off:</strong> ${booking.destinationAddress || booking.dropLocation}</p>
      <p style="margin: 4px 0;"><strong>Pickup Time:</strong> ${new Date(booking.pickupDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p style="margin: 4px 0;"><strong>Estimated Fare:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">PENDING CONFIRMATION</span></p>
    </div>

    <p style="font-size: 14px; color: #475569;">
      Our fleet coordinator will verify route requirements, adjust any custom pricing if needed, and confirm your booking shortly. You will receive an instant email notification once confirmed.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${siteUrl}/profile" class="button">View Trip in Profile</a>
    </div>
  `;

  return baseLayout({
    title: `Booking Request Received - ${booking.bookingId}`,
    content,
  });
}

/**
 * Admin new booking inquiry notification alert
 */
export function bookingInquiryAdminAlertEmailTemplate({ booking, user, siteUrl = resolveBaseUrl() }) {
  const amount = booking.totalEstimatedAmount || booking.totalAmount || 0;
  const content = `
    <h2 style="color: #9333ea;">${lucideBadge('alertCircle', '#9333ea', '#f5f3ff', 20)} New Booking Inquiry Alert</h2>
    <p>A new customer ride inquiry has been submitted and is awaiting confirmation on the Live Dispatch Desk.</p>

    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Booking ID:</strong> <span class="highlight">${booking.bookingId}</span></p>
      <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${user?.name || 'Customer'}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${user?.email}">${user?.email}</a></p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:${user?.phone}">${user?.phone || 'Not Provided'}</a></p>
      <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${booking.carModel || 'Vehicle'} (${booking.carCategory || 'Sedan'})</p>
      <p style="margin: 4px 0;"><strong>Route:</strong> ${booking.pickupAddress || booking.pickupLocation} ➔ ${booking.destinationAddress || booking.dropLocation}</p>
      <p style="margin: 4px 0;"><strong>Pickup Timing:</strong> ${new Date(booking.pickupDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p style="margin: 4px 0;"><strong>Passengers:</strong> ${booking.passengers || 1}</p>
      <p style="margin: 4px 0;"><strong>Estimated Amount:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p>
      ${booking.customerNotes ? `<p style="margin: 4px 0;"><strong>Customer Notes:</strong> ${booking.customerNotes}</p>` : ''}
    </div>

    <p style="font-size: 13px; color: #64748b;">
      You can adjust the final invoice amount and assign an available chauffeur before confirming the trip.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${siteUrl}/admin/bookings" class="button" style="background-color: #9333ea;">Open Admin Dispatch Desk</a>
    </div>
  `;

  return baseLayout({
    title: `[ALERT] New Booking Request: ${booking.bookingId}`,
    content,
  });
}

/**
 * Booking status update email template (Confirmed, Cancelled, In-Journey)
 */
export function bookingStatusUpdateEmailTemplate({ booking, user, newStatus, adminNotes, siteUrl = resolveBaseUrl() }) {
  const amount = booking.totalEstimatedAmount || booking.totalAmount || 0;
  const isConfirmed = newStatus === 'Confirmed';
  const isCancelled = newStatus === 'Cancelled';

  const headingHtml = isConfirmed
    ? `<h2>${lucideBadge('checkCircle', '#10b981', '#ecfdf5', 20)} Trip Confirmed!</h2>`
    : isCancelled
    ? `<h2>${lucideBadge('alertTriangle', '#ef4444', '#fef2f2', 20)} Booking Cancelled</h2>`
    : `<h2>${lucideBadge('car', '#1e3a8a', '#eff6ff', 20)} Booking Status: ${newStatus}</h2>`;

  const content = `
    ${headingHtml}
    <p>Dear ${user?.name || 'Customer'},</p>
    <p>
      ${
        isConfirmed
          ? 'Great news! Your booking has been confirmed by our fleet coordinator.'
          : isCancelled
          ? 'Your booking with Comfort Trip has been cancelled.'
          : `Your booking status has been updated to <strong>${newStatus}</strong>.`
      }
    </p>

    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingId}</span></p>
      <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${booking.carModel || 'Vehicle'} (${booking.carCategory || 'Sedan'})</p>
      <p style="margin: 4px 0;"><strong>Route:</strong> ${booking.pickupAddress || booking.pickupLocation} ➔ ${booking.destinationAddress || booking.dropLocation}</p>
      <p style="margin: 4px 0;"><strong>Pickup Time:</strong> ${new Date(booking.pickupDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p style="margin: 4px 0;"><strong>Confirmed Fare:</strong> <strong style="color: #10b981; font-size: 16px;">₹${Number(amount).toLocaleString('en-IN')}</strong></p>
      <p style="margin: 4px 0;"><strong>Status:</strong> <span class="highlight">${newStatus?.toUpperCase()}</span></p>
      ${adminNotes ? `<p style="margin: 4px 0;"><strong>Dispatch Note:</strong> ${adminNotes}</p>` : ''}
    </div>

    ${
      isConfirmed
        ? '<p>Our chauffeur will arrive at the scheduled pickup point on time. Track updates directly in your dashboard.</p>'
        : ''
    }

    <div style="text-align: center; margin: 24px 0;">
      <a href="${siteUrl}/profile" class="button">View Booking Status</a>
    </div>
  `;

  return baseLayout({
    title: `Booking Update: ${newStatus} - ${booking.bookingId}`,
    content,
  });
}

/**
 * Trip completed & review invite email template with downloadable invoice PDF link
 */
export function tripCompletedEmailTemplate({ booking, user, rewardPointsEarned = 5, invoiceUrl = null, siteUrl = resolveBaseUrl() }) {
  const downloadLink = invoiceUrl || `${siteUrl}/api/bookings/${booking.bookingId}/invoice`;
  const amount = booking.totalEstimatedAmount || booking.totalAmount || 0;

  const content = `
    <h2>${lucideBadge('flag', '#10b981', '#ecfdf5', 20)} Trip Completed &mdash; Thank You!</h2>
    <p>Dear ${user?.name || 'Customer'}, thank you for riding with Comfort Trip Car Rentals on booking <strong>${booking.bookingId}</strong>.</p>

    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span class="highlight">${booking.bookingId}</span></p>
      <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${booking.carModel || 'Vehicle'} (${booking.carCategory || 'Sedan'})</p>
      <p style="margin: 4px 0;"><strong>Final Bill Amount:</strong> <strong style="color: #10b981; font-size: 16px;">₹${Number(amount).toLocaleString('en-IN')}</strong></p>
      <p style="margin: 4px 0;"><strong>Route:</strong> ${booking.pickupAddress || booking.pickupLocation} ➔ ${booking.destinationAddress || booking.dropLocation}</p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${downloadLink}" class="button" style="background-color: #9333ea; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
        ${getLucideSvg('fileText', { size: 18, color: '#ffffff' })} <span style="vertical-align: middle; margin-left: 6px;">Download Tax Invoice (PDF)</span>
      </a>
    </div>

    <div class="info-box" style="border-left-color: #f59e0b;">
      <h3 style="margin-top:0;">${lucideBadge('star', '#f59e0b', '#fef3c7', 16)} Share Feedback & Earn +${rewardPointsEarned} Points</h3>
      <p>How was your chauffeur and vehicle experience? Submit a 1-minute review and receive an additional <strong>+${rewardPointsEarned} reward points</strong> credited instantly to your wallet!</p>
      <div style="margin-top: 12px;">
        <a href="${siteUrl}/profile" style="color: #9333ea; font-weight: bold; text-decoration: underline;">
          Rate Your Ride & Claim Reward Points &rarr;
        </a>
      </div>
    </div>
  `;

  return baseLayout({
    title: `Trip Completed & Invoice Ready - ${booking.bookingId}`,
    content,
  });
}

/**
 * Password reset email template with 30-minute session expiry
 */
export function passwordResetEmailTemplate({ name, resetUrl, siteUrl = resolveBaseUrl() }) {
  const content = `
    <h2>${lucideBadge('keyRound', '#9333ea', '#f5f3ff', 20)} Password Reset Request</h2>
    <p>Dear ${name || 'Valued Member'},</p>
    <p>We received a request to reset your password for your Comfort~Trip account.</p>

    <div class="info-box">
      <h3 style="margin-top:0;">${lucideBadge('clock', '#9333ea', '#f5f3ff', 16)} Security Notice</h3>
      <p>This password reset session link is valid for exactly <strong style="color: #9333ea;">30 minutes</strong>. After 30 minutes, this link will automatically expire for your security.</p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" class="button" style="background-color: #9333ea; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
        Reset Your Password
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this link into your browser:</p>
    <p style="font-size: 12px; word-break: break-all; color: #9333ea;"><a href="${resetUrl}" style="color: #9333ea;">${resetUrl}</a></p>

    <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
      If you did not initiate this request, you can safely ignore this email. Your existing password will remain secure and unchanged.
    </p>
  `;

  return baseLayout({
    title: 'Reset Your Comfort~Trip Password (Valid for 30 Minutes)',
    content,
  });
}
