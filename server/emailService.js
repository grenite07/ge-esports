import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether started from workspace root, server/, or container
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BRAND_NAME = 'GE ESPORTS (Grenite Esports)';

/**
 * Read and normalize email & SMTP configuration dynamically from environment variables
 */
export function getEmailConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const rawPort = process.env.SMTP_PORT || '465';
  const port = parseInt(rawPort, 10) || 465;

  // SMTP_SECURE: true for port 465 (SSL/TLS), false for port 587/25 (STARTTLS)
  let secure;
  if (process.env.SMTP_SECURE !== undefined && process.env.SMTP_SECURE !== '') {
    const s = String(process.env.SMTP_SECURE).trim().toLowerCase();
    secure = s === 'true' || s === '1' || s === 'yes';
  } else {
    secure = port === 465;
  }

  const user = process.env.SMTP_USER || process.env.SENDER_EMAIL || 'grenite07@gmail.com';
  let pass = (process.env.SMTP_PASS || '').trim();

  // Strip spaces if user pasted a 16-character Google App Password with space separators
  if (host.includes('gmail.com') && pass.replace(/\s+/g, '').length === 16) {
    pass = pass.replace(/\s+/g, '');
  }

  const senderEmail = process.env.SENDER_EMAIL || user;
  const adminEmail = process.env.ADMIN_EMAIL || user;

  return { host, port, secure, user, pass, senderEmail, adminEmail };
}

/**
 * Instantiate a Nodemailer transport instance
 */
function createTransportInstance({ host, port, secure, user, pass }) {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.NODE_ENV === 'production' && !process.env.ALLOW_SELF_SIGNED_CERTS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

let activeTransporter = null;
let lastVerifiedKey = null;

/**
 * Initialize and verify email transporter
 */
export async function getTransporter() {
  const config = getEmailConfig();
  const configKey = `${config.host}:${config.port}:${config.secure}:${config.user}:${config.pass ? 'hasPass' : 'noPass'}`;

  if (activeTransporter && lastVerifiedKey === configKey) {
    return activeTransporter;
  }

  if (config.pass) {
    // 1. Attempt primary configured transport
    try {
      const primaryMailer = createTransportInstance(config);
      await primaryMailer.verify();
      console.log(`✔ SMTP Transporter verified successfully via ${config.host}:${config.port} (secure: ${config.secure}) for ${config.user}.`);
      activeTransporter = primaryMailer;
      lastVerifiedKey = configKey;
      return activeTransporter;
    } catch (primaryErr) {
      console.warn(`⚠ Primary SMTP verification failed (${config.host}:${config.port}, secure: ${config.secure}): ${primaryErr.message}`);

      // 2. Cloud provider / network fallback: If 465 failed (often firewalled), try 587 (or vice-versa)
      const altPort = config.port === 465 ? 587 : (config.port === 587 ? 465 : null);
      if (altPort !== null) {
        const altSecure = altPort === 465;
        console.log(`🔄 Attempting alternate SMTP configuration on ${config.host}:${altPort} (secure: ${altSecure})...`);
        try {
          const fallbackMailer = createTransportInstance({
            ...config,
            port: altPort,
            secure: altSecure,
          });
          await fallbackMailer.verify();
          console.log(`✔ Alternate SMTP Transporter verified successfully via ${config.host}:${altPort} for ${config.user}.`);
          activeTransporter = fallbackMailer;
          lastVerifiedKey = configKey;
          return activeTransporter;
        } catch (fallbackErr) {
          console.warn(`⚠ Alternate SMTP verification also failed (${config.host}:${altPort}): ${fallbackErr.message}`);
        }
      }

      // Return the unverified instance so sendMail can attempt or throw informative error
      return createTransportInstance(config);
    }
  }

  // Fallback simulator driver for local development when SMTP_PASS is not provided
  console.log(`ℹ No SMTP_PASS configured in environment; utilizing local simulated mail driver.`);
  return {
    sendMail: async (mailOptions) => {
      const messageId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      console.log(`[LOCAL SIMULATED DISPATCH] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
      return {
        messageId,
        response: '250 OK (Simulated - No SMTP_PASS configured)',
        simulated: true,
      };
    },
  };
}

/**
 * Direct Relay Dispatcher
 * Sends email directly to destination (grenite07@gmail.com) via verified HTTPS relay
 */
export async function sendDirectRelayEmail({ to, replyTo, subject, fields }) {
  const { adminEmail } = getEmailConfig();
  const targetEmail = to || adminEmail;
  try {
    const payload = {
      _subject: subject,
      _replyto: replyTo || adminEmail,
      ...fields,
      _template: 'table',
      _captcha: 'false',
    };

    const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✔ [DIRECT RELAY SUCCESS] Email transmitted to ${targetEmail}`);
      return { success: true, method: 'direct_relay', details: data };
    } else {
      const errText = await res.text().catch(() => '');
      console.warn(`[DIRECT RELAY WARN] HTTP ${res.status}: ${errText}`);
      return { success: false, status: res.status, error: errText };
    }
  } catch (err) {
    console.warn(`[DIRECT RELAY EXCEPTION]:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Contact Message Email
 */
export async function sendContactEmail({ name, email, subject, category, message, phone }) {
  const { senderEmail, adminEmail, pass } = getEmailConfig();
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let adminDeliverySuccess = false;
  let adminMessageId = null;
  let lastError = null;

  // 1. Attempt SMTP Transporter
  try {
    const mailer = await getTransporter();
    const adminMail = {
      from: `"${name} via GE ESPORTS" <${senderEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[GE INQUIRY] [${category || 'General'}] ${subject || 'Inquiry'}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #DDE1E8; border: 1px solid #23242c; border-radius: 12px; overflow: hidden;">
          <div style="background: #111114; padding: 24px; border-bottom: 2px solid #075BFF;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">GE ESPORTS // TRANSMISSION</h2>
            <p style="color: #075BFF; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">NEW INCOMING CONTACT INQUIRY</p>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <div style="background: #15151a; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #23242c;">
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #075BFF;">${email}</a></p>
              ${phone ? `<p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Phone / WhatsApp:</strong> ${phone}</p>` : ''}
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Category:</strong> <span style="background: #075BFF; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px;">${category}</span></p>
              <p style="margin: 0; font-size: 13px;"><strong>Timestamp:</strong> ${timestamp} IST</p>
            </div>
            <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase;">Subject: ${subject}</h4>
            <div style="background: #000000; padding: 16px; border-radius: 8px; border: 1px solid #23242c; white-space: pre-wrap; font-size: 14px; color: #eaeaea;">${message}</div>
            <div style="margin-top: 24px;">
              <a href="mailto:${email}?subject=Re: [GE ESPORTS] ${encodeURIComponent(subject || 'Inquiry')}" style="display: inline-block; background: #075BFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;">REPLY DIRECTLY TO SENDER</a>
            </div>
          </div>
        </div>
      `,
    };

    const adminResult = await mailer.sendMail(adminMail);
    adminDeliverySuccess = true;
    adminMessageId = adminResult.messageId;
    console.log(`✔ [CONTACT EMAIL SENT] Notification delivered to ${adminEmail} (ID: ${adminMessageId})`);
  } catch (err) {
    lastError = err;
    console.error('SMTP error sending contact email:', err.message);
  }

  // 2. Direct Relay Fallback (attempts HTTPS relay if SMTP failed and target is admin)
  if (!adminDeliverySuccess) {
    console.log('Attempting direct relay fallback for contact inquiry...');
    const relayResult = await sendDirectRelayEmail({
      to: adminEmail,
      replyTo: email,
      subject: `[GE TRANSMISSION] [${category || 'General'}] ${subject || 'Inquiry'} from ${name}`,
      fields: {
        'Sender Name': name,
        'Email Address': email,
        'Phone Number': phone || 'N/A',
        'Inquiry Category': category || 'General',
        'Subject': subject || 'Inquiry',
        'Message Body': message,
        'Received Time': `${timestamp} IST`,
      },
    });
    if (relayResult.success) {
      adminDeliverySuccess = true;
      adminMessageId = `relay_${Date.now()}`;
      lastError = null;
    }
  }

  // 3. Automated User confirmation receipt (best-effort)
  if (email && email.includes('@')) {
    try {
      const mailer = await getTransporter();
      const userMail = {
        from: `"${BRAND_NAME}" <${senderEmail}>`,
        to: email,
        subject: `We have received your message // GE ESPORTS`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #DDE1E8; border: 1px solid #23242c; border-radius: 12px; overflow: hidden;">
            <div style="background: #111114; padding: 24px; border-bottom: 2px solid #075BFF;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">GE ESPORTS</h2>
              <p style="color: #888888; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">UNLEASH THE STORM // OFFICIAL TRANSMISSION</p>
            </div>
            <div style="padding: 24px; line-height: 1.6;">
              <p style="color: #ffffff; font-size: 16px; font-weight: bold;">Hello ${name},</p>
              <p style="font-size: 14px; color: #a0a0a8;">
                Thank you for getting in touch with Grenite Esports. Your transmission regarding <strong>"${subject || 'Inquiry'}"</strong> has been logged and forwarded directly to management at <strong>${adminEmail}</strong>.
              </p>
              <div style="background: #15151a; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #23242c; font-size: 13px;">
                <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${category || 'General'}</p>
                <p style="margin: 0 0 6px 0;"><strong>Logged Time:</strong> ${timestamp} IST</p>
                <p style="margin: 0;"><strong>Expected Response:</strong> Within 24 hours</p>
              </div>
              <p style="font-size: 13px; color: #888888;">
                Official Instagram: @ind_greniteesp<br>
                Official YouTube: https://youtube.com/@-grenite07?si=kueyy9MemP5NJEGP<br>
                Official Discord: https://discord.gg/YgwX4sSkx
              </p>
            </div>
          </div>
        `,
      };
      await mailer.sendMail(userMail);
      console.log(`✔ [USER CONFIRMATION SENT] Confirmation delivered to ${email}`);
    } catch (err) {
      console.warn('Could not dispatch automated confirmation copy to user:', err.message);
    }
  }

  return {
    success: adminDeliverySuccess || !pass, // If in local simulated mode (!pass), treat as simulated success
    messageId: adminMessageId || `ticket_${Date.now()}`,
    directDelivered: adminDeliverySuccess,
    error: adminDeliverySuccess ? undefined : (lastError ? lastError.message : 'Email delivery failed'),
  };
}

/**
 * Send Recruitment Application Notification Email to ADMIN & Player
 */
export async function sendRecruitmentEmail(application) {
  const { senderEmail, adminEmail, pass } = getEmailConfig();
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let adminDeliverySuccess = false;
  let adminMessageId = null;
  let lastError = null;

  // 1. Notify Management via SMTP
  try {
    const mailer = await getTransporter();
    const adminMail = {
      from: `"${application.ign} Tryouts via GE ESPORTS" <${senderEmail}>`,
      to: adminEmail,
      replyTo: application.contactEmail,
      subject: `[GE SCOUTING APPLICATION] ${application.ign} (${application.preferredRole}) - UID: ${application.uid}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #DDE1E8; border: 1px solid #23242c; border-radius: 12px; overflow: hidden;">
          <div style="background: #111114; padding: 24px; border-bottom: 2px solid #8B5CF6;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">NEW PRO TRYOUT APPLICATION</h2>
            <p style="color: #00F0FF; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">APPLICATION ID: ${application.id}</p>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <div style="background: #15151a; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #23242c; font-size: 13px;">
              <p style="margin: 0 0 6px 0;"><strong>In-Game Name (IGN):</strong> <span style="color: #00F0FF; font-size: 15px; font-weight: bold;">${application.ign}</span></p>
              <p style="margin: 0 0 6px 0;"><strong>Full Name:</strong> ${application.fullName}</p>
              <p style="margin: 0 0 6px 0;"><strong>Free Fire UID:</strong> <code style="background: #000; padding: 2px 6px; border-radius: 4px; color: #fff;">${application.uid}</code></p>
              <p style="margin: 0 0 6px 0;"><strong>Preferred Role:</strong> ${application.preferredRole}</p>
              <p style="margin: 0 0 6px 0;"><strong>Contact Email:</strong> <a href="mailto:${application.contactEmail}" style="color: #075BFF;">${application.contactEmail}</a></p>
              <p style="margin: 0 0 6px 0;"><strong>Phone / WhatsApp:</strong> ${application.contactPhone}</p>
              ${application.discordId ? `<p style="margin: 0 0 6px 0;"><strong>Discord:</strong> ${application.discordId}</p>` : ''}
              <p style="margin: 0 0 6px 0;"><strong>Previous Teams:</strong> ${application.previousTeams || 'Free Agent'}</p>
              <p style="margin: 0 0 6px 0;"><strong>Experience:</strong> ${application.competitiveExperience || 'N/A'}</p>
              <p style="margin: 0 0 6px 0;"><strong>Highlight Reel / VOD:</strong> <a href="${application.gameplayVideoUrl}" target="_blank" style="color: #00F0FF; font-weight: bold; text-decoration: underline;">Open Gameplay Clip</a></p>
              <p style="margin: 0;"><strong>Submitted:</strong> ${timestamp} IST</p>
            </div>
            <a href="mailto:${application.contactEmail}?subject=GE ESPORTS Tryout Invitation // ${application.ign}" style="display: inline-block; background: #075BFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;">CONTACT APPLICANT</a>
          </div>
        </div>
      `,
    };
    const adminResult = await mailer.sendMail(adminMail);
    adminDeliverySuccess = true;
    adminMessageId = adminResult.messageId;
    console.log(`✔ [RECRUITMENT EMAIL SENT] Scouting report delivered to ${adminEmail} (ID: ${adminMessageId})`);
  } catch (err) {
    lastError = err;
    console.error('SMTP error for recruitment email:', err.message);
  }

  // 2. Direct Relay Fallback to adminEmail
  if (!adminDeliverySuccess) {
    console.log('Attempting direct relay fallback for recruitment application...');
    const relayResult = await sendDirectRelayEmail({
      to: adminEmail,
      replyTo: application.contactEmail,
      subject: `[GE SCOUTING APPLICATION] ${application.ign} (${application.preferredRole}) - UID: ${application.uid}`,
      fields: {
        'Application Reference': application.id,
        'In-Game Name (IGN)': application.ign,
        'Full Name': application.fullName,
        'Free Fire UID': application.uid,
        'Preferred Role': application.preferredRole,
        'Contact Email': application.contactEmail,
        'Phone / WhatsApp': application.contactPhone,
        'Discord Tag': application.discordId || 'N/A',
        'Gameplay Reel / VOD': application.gameplayVideoUrl,
        'Competitive Experience': application.competitiveExperience || 'None',
        'Past Teams': application.previousTeams || 'Free Agent',
        'Submission Timestamp': `${timestamp} IST`,
      },
    });
    if (relayResult.success) {
      adminDeliverySuccess = true;
      adminMessageId = `relay_${Date.now()}`;
      lastError = null;
    }
  }

  // 3. Confirmation to Candidate (best-effort)
  if (application.contactEmail && application.contactEmail.includes('@')) {
    try {
      const mailer = await getTransporter();
      const userMail = {
        from: `"${BRAND_NAME} Scouting" <${senderEmail}>`,
        to: application.contactEmail,
        subject: `Scouting File Logged [${application.id}] — GE ESPORTS Free Fire`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #DDE1E8; border: 1px solid #23242c; border-radius: 12px; overflow: hidden;">
            <div style="background: #111114; padding: 24px; border-bottom: 2px solid #075BFF;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">GE ESPORTS // TALENT ACQUISITION</h2>
              <p style="color: #075BFF; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">SCOUTING REFERENCE: ${application.id}</p>
            </div>
            <div style="padding: 24px; line-height: 1.6;">
              <p style="color: #ffffff; font-size: 16px; font-weight: bold;">Greetings ${application.ign} (${application.fullName}),</p>
              <p style="font-size: 14px; color: #a0a0a8;">
                Your Free Fire India competitive tryout application has been received and delivered directly to the GE Esports coaching desk at <strong>${adminEmail}</strong>.
              </p>
              <div style="background: #15151a; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #23242c; font-size: 13px;">
                <p style="margin: 0 0 6px 0;"><strong>In-Game Name (IGN):</strong> ${application.ign}</p>
                <p style="margin: 0 0 6px 0;"><strong>Free Fire UID:</strong> ${application.uid}</p>
                <p style="margin: 0 0 6px 0;"><strong>Preferred Role:</strong> ${application.preferredRole}</p>
                <p style="margin: 0 0 6px 0;"><strong>Clip / Highlight:</strong> <a href="${application.gameplayVideoUrl}" style="color: #075BFF;" target="_blank">View Reel</a></p>
                <p style="margin: 0;"><strong>Status:</strong> PENDING REVIEW</p>
              </div>
              <p style="font-size: 13px; color: #888888;">
                Our coaching staff evaluates VOD mechanics, team callouts, and zone play weekly. If shortlisted for closed scrims tryouts, you will be contacted via WhatsApp or Discord.
              </p>
              <p style="margin-top: 24px; font-size: 12px; color: #666666; font-family: monospace;">
                GE ESPORTS // UNLEASH THE STORM<br>
                Official Discord: https://discord.gg/YgwX4sSkx<br>
                Official YouTube: https://youtube.com/@-grenite07?si=kueyy9MemP5NJEGP
              </p>
            </div>
          </div>
        `,
      };
      await mailer.sendMail(userMail);
      console.log(`✔ [CANDIDATE CONFIRMATION SENT] Scouting confirmation delivered to ${application.contactEmail}`);
    } catch (err) {
      console.warn('Could not dispatch player tryout confirmation copy:', err.message);
    }
  }

  return {
    success: adminDeliverySuccess || !pass,
    messageId: adminMessageId || application.id,
    directDelivered: adminDeliverySuccess,
    error: adminDeliverySuccess ? undefined : (lastError ? lastError.message : 'Email delivery failed'),
  };
}

/**
 * Send Priority Drop / Newsletter Subscription Confirmation
 */
export async function sendDropAlertEmail({ email, productName }) {
  const { senderEmail } = getEmailConfig();
  try {
    const mailer = await getTransporter();
    const mailOptions = {
      from: `"${BRAND_NAME}" <${senderEmail}>`,
      to: email,
      subject: `Priority Access Confirmed // GE ESPORTS Collection`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #DDE1E8; border: 1px solid #23242c; border-radius: 12px; overflow: hidden;">
          <div style="background: #111114; padding: 24px; border-bottom: 2px solid #075BFF;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">GE ESPORTS COLLECTION</h2>
            <p style="color: #075BFF; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">DROP PRIORITY RESERVATION</p>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <p style="color: #ffffff; font-size: 15px;">Your VIP priority notification reservation for <strong>${productName || 'The GE Official Collection'}</strong> has been registered.</p>
            <p style="font-size: 13px; color: #a0a0a8;">
              You will receive private early-access purchase links 1 hour before general public drop releases.
            </p>
          </div>
        </div>
      `,
    };
    const res = await mailer.sendMail(mailOptions);
    return { success: true, messageId: res.messageId };
  } catch (err) {
    console.warn('Drop alert email warning:', err.message);
    return { success: false, error: err.message };
  }
}
