import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { findBookingById, findBookingByBookingId } from '@/repositories/bookingRepository';

/**
 * Downloadable Tax Invoice PDF Generator (CT-2026-001.pdf)
 */
export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to download your tax invoice.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    // Find by ObjectId or sequential bookingId
    let booking = await findBookingById(id);
    if (!booking) {
      booking = await findBookingByBookingId(id);
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking record not found.' },
        { status: 404 }
      );
    }

    // Authorization: User must own the booking or have admin privileges
    const isOwner = String(session.user.id) === String(booking.user?._id || booking.user);
    const isAdmin = session.user.role === 'admin' || session.user.role === 'super-admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to download this invoice.' },
        { status: 403 }
      );
    }

    // Generate PDF using PDFKit in memory
    const pdfBuffer = await generateInvoicePdf(booking);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${booking.bookingId}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[Invoice API Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate tax invoice' },
      { status: 500 }
    );
  }
}

/**
 * Helper to build PDF document buffer
 * @param {Object} booking
 * @returns {Promise<Buffer>}
 */
function generateInvoicePdf(booking) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    const primaryColor = '#9333ea'; // Brand third-color purple
    const darkColor = '#212832';
    const grayColor = '#64748b';

    // Header: Brand & Company Info
    doc
      .fontSize(24)
      .fillColor(primaryColor)
      .text('Comfort~Trip', 40, 40, { bold: true })
      .fontSize(9)
      .fillColor(grayColor)
      .text('Comfort Trip Car Rentals Rajkot', 40, 68)
      .text('Ramdevpir Chowk, 150 Ft Ring Road, Gandhigram', 40, 80)
      .text('Rajkot, Gujarat - 360007 | Tel: +91 9974833330', 40, 92)
      .text('GSTIN:           | contact@comforttrip.in', 40, 104);

    // Invoice Meta Right Column
    doc
      .fontSize(16)
      .fillColor(darkColor)
      .text('TAX INVOICE', 350, 40, { align: 'right', bold: true })
      .fontSize(9)
      .fillColor(grayColor)
      .text(`Invoice No: ${booking.bookingId}`, 350, 64, { align: 'right' })
      .text(
        `Invoice Date: ${new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN')}`,
        350,
        78,
        { align: 'right' }
      )
      .text(`Trip Status: ${booking.status?.toUpperCase()}`, 350, 92, { align: 'right' });

    doc.moveTo(40, 125).lineTo(555, 125).strokeColor('#e2e8f0').stroke();

    // Bill To Customer Details
    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text('Billed To Customer:', 40, 140, { bold: true })
      .fontSize(10)
      .fillColor('#334155')
      .text(`Name: ${booking.user?.name || 'Customer'}`, 40, 158)
      .text(`Email: ${booking.user?.email || 'N/A'}`, 40, 172)
      .text(`Mobile: ${booking.user?.phone || 'N/A'}`, 40, 186);

    // Journey & Vehicle Details
    doc
      .fontSize(11)
      .fillColor(darkColor)
      .text('Trip & Vehicle Details:', 300, 140, { bold: true })
      .fontSize(10)
      .fillColor('#334155')
      .text(`Vehicle: ${booking.car?.brand || ''} ${booking.car?.model || 'Rental Vehicle'}`, 300, 158)
      .text(`Category: ${booking.car?.category || 'Chauffeur Car'}`, 300, 172)
      .text(`Trip Type: ${booking.tripType}`, 300, 186);

    // Route Information Box
    doc
      .roundedRect(40, 215, 515, 60, 6)
      .fillColor('#f8fafc')
      .fill()
      .strokeColor('#cbd5e1')
      .stroke();

    doc
      .fontSize(9)
      .fillColor(darkColor)
      .text('Pickup Location:', 52, 225, { bold: true })
      .fillColor('#475569')
      .text(booking.pickupAddress, 135, 225)
      .fillColor(darkColor)
      .text('Drop Location:', 52, 240, { bold: true })
      .fillColor('#475569')
      .text(booking.destinationAddress, 135, 240)
      .fillColor(darkColor)
      .text('Pickup Date/Time:', 52, 255, { bold: true })
      .fillColor('#475569')
      .text(
        new Date(booking.pickupDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        135,
        255
      );

    // Assigned Chauffeur (if assigned)
    if (booking.assignedDriver?.name) {
      doc
        .fontSize(9)
        .fillColor(darkColor)
        .text('Chauffeur:', 340, 225, { bold: true })
        .fillColor('#475569')
        .text(
          `${booking.assignedDriver.name} (${booking.assignedDriver.phone || ''})`,
          400,
          225
        );
    }

    // Fare Breakdown Table Header
    const tableTop = 295;
    doc
      .rect(40, tableTop, 515, 24)
      .fillColor('#f1f5f9')
      .fill();

    doc
      .fontSize(9)
      .fillColor(darkColor)
      .text('Item Description', 50, tableTop + 7, { bold: true })
      .text('Type', 280, tableTop + 7, { bold: true })
      .text('Rate', 380, tableTop + 7, { bold: true })
      .text('Amount (INR)', 480, tableTop + 7, { bold: true });

    // Table Content (No GST tax amount added; GST number left blank)
    const totalAmount = Number(booking.totalEstimatedAmount) || 2000;

    let y = tableTop + 32;

    doc
      .fontSize(9)
      .fillColor('#334155')
      .text(`${booking.tripType} Chauffeur Driven Rental`, 50, y)
      .text(booking.car?.category || 'Standard', 280, y)
      .text(`Base`, 380, y)
      .text(`Rs. ${totalAmount.toLocaleString('en-IN')}`, 470, y);

    y += 20;
    doc.moveTo(40, y).lineTo(555, y).strokeColor('#e2e8f0').stroke();

    y += 10;
    doc
      .text('Goods & Services Tax (GST)', 50, y)
      .text('0%', 280, y)
      .text('Exempt', 380, y)
      .text('Rs. 0', 470, y);

    y += 24;
    doc
      .rect(40, y, 515, 28)
      .fillColor('#faf5ff') // Light purple background
      .fill()
      .strokeColor(primaryColor)
      .stroke();

    doc
      .fontSize(11)
      .fillColor(primaryColor)
      .text('Total Invoice Amount:', 50, y + 8, { bold: true })
      .text(`Rs. ${totalAmount.toLocaleString('en-IN')}`, 460, y + 8, { bold: true });

    // Footer & Policies
    doc
      .fontSize(8)
      .fillColor(grayColor)
      .text('Terms & Conditions:', 40, 480, { bold: true })
      .text('1. Tolls, state taxes, and parking fees are itemized and billed as per actual receipts.', 40, 492)
      .text('2. Passenger coverage is subject to standard motor vehicle insurance guidelines.', 40, 502)
      .text('3. For any dispute or clarification, write to support@comforttrip.in with your Booking ID.', 40, 512);

    doc
      .fontSize(9)
      .fillColor(darkColor)
      .text('Thank you for riding with Comfort Trip Car Rentals!', 40, 545, { align: 'center', bold: true })
      .fontSize(8)
      .fillColor(grayColor)
      .text('This is an official, computer-generated tax invoice. No signature required.', 40, 560, {
        align: 'center',
      });

    doc.end();
  });
}
