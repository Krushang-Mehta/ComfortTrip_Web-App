import nodemailer from 'nodemailer';

let cachedTransporter = null;

/**
 * Get or initialize nodemailer transporter instance
 * @returns {import('nodemailer').Transporter}
 */
export function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[SMTP] Email service not fully configured. Using mock mailer logger.');
    return {
      sendMail: async (options) => {
        console.log('[SMTP MOCK SEND]', {
          to: options.to,
          subject: options.subject,
          from: options.from,
        });
        return { messageId: `mock-${Date.now()}` };
      },
      verify: async () => true,
    };
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

/**
 * Send a transactional email
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body
 * @param {string} [params.text] - Plain text fallback
 * @returns {Promise<Object>}
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || 'Comfort Trip Car Rentals <noreply@comforttrip.in>';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ' '),
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[SMTP Error] Failed to send email to', to, error);
    return { success: false, error: error.message };
  }
}
