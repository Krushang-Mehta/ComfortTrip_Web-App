import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, pickup, destination, passengers, car } = req.body;

  // Define your admin email
  const adminEmail = "admin@example.com"; // Change this to your actual admin email

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email app password (use an App Password if using Gmail)
    },
  });

  try {
    // Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "New Booking Request",
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Pickup Address:</strong> ${pickup}</p>
        <p><strong>Destination Address:</strong> ${destination}</p>
        <p><strong>Passengers:</strong> ${passengers}</p>
        <p><strong>Selected Car:</strong> ${car}</p>
      `,
    });

    // Email to User (Confirmation)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation",
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking with us! Your ride details are as follows:</p>
        <ul>
          <li><strong>Pickup:</strong> ${pickup}</li>
          <li><strong>Destination:</strong> ${destination}</li>
          <li><strong>Passengers:</strong> ${passengers}</li>
          <li><strong>Car:</strong> ${car}</li>
        </ul>
        <p>We will contact you soon.</p>
        <p>Best regards, <br> Comfort Bookings</p>
      `,
    });

    res.status(200).json({ message: "Booking request sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}



// import nodemailer from 'nodemailer';

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: "Method Not Allowed" });
//     }

//     const { name, email, phone, pickup, destination, passengers, car } = req.body;

//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     try {
//         await transporter.sendMail({
//             from: `"Comfort Bookings" <${process.env.EMAIL_USER}>`,
//             to: process.env.ADMIN_EMAIL,
//             subject: "New Booking Request",
//             text: `
//                 Name: ${name}
//                 Email: ${email}
//                 Phone: ${phone}
//                 Pickup: ${pickup}
//                 Destination: ${destination}
//                 Passengers: ${passengers}
//                 Car Selected: ${car}
//             `,
//         });

//         await transporter.sendMail({
//             from: `"Comfort Bookings" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Booking Confirmation",
//             text: `Hello ${name},\n\nYour booking request has been received.\n\nWe will contact you soon!\n\nThanks,\nComfort Bookings`
//         });

//         return res.status(200).json({ message: "Booking request sent successfully!" });
//     } catch (error) {
//         return res.status(500).json({ message: "Error sending emails", error: error.message });
//     }
// }
