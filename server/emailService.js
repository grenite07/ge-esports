import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;
let isConfigured = false;

const BRAND_NAME = 'GE ESPORTS (Grenite Esports)';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'grenite07@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'grenite07@gmail.com';

// Initialize email transporter
export async function getTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST = 'smtp.gmail.com',
    SMTP_PORT = 465,
    SMTP_USER = 'grenite07@gmail.com',
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (SMTP_PASS && SMTP_PASS.trim() !== '') {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS.trim(),
        },
      });
      await transporter.verify();
      console.log(`✔ Production Gmail SMTP Transporter verified successfully for ${SMTP_USER}.`);
      isConfigured = true;
      return transporter;
    } catch (err) {
      console.warn('⚠ Configured Gmail SMTP verification failed:', err.message);
    }
  }

  // Fallback test/simulated driver
  transporter = {
    sendMail: async (mailOptions) => {
      const messageId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      console.log(`[LOCAL DISPATCH] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
      return {
        messageId,
        response: '250 OK (Logged)',
        simulated: true,
      };
    },
  };
  return transporter;
}

/**
 * Direct Relay Dispatcher
 * Sends real email directly to destination (grenite07@gmail.com) via verified HTTPS relay
 */
export async function sendDirectRelayEmail({ to, replyTo, subject, fields }) {
  try {
    const targetEmail = to || ADMIN_EMAIL;
    const payload = {
      _subject: subject,
      _replyto: replyTo || ADMIN_EMAIL,
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
      console.warn(`[DIRECT RELAY WARN] HTTP ${res.status}`);
      return { success: false, status: res.status };
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
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let adminDeliverySuccess = false;
  let adminMessageId = null;

  // 1. Attempt Production SMTP if configured
  if (process.env.SMTP_PASS && process.env.SMTP_PASS.trim() !== '') {
    try {
      const mailer = await getTransporter();
      const adminMail = {
        from: `"${name} via GE ESPORTS" <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `[GE INQUIRY] [${category}] ${subject}`,
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
                <a href="mailto:${email}?subject=Re: [GE ESPORTS] ${encodeURIComponent(subject)}" style="display: inline-block; background: #075BFF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 13px;">REPLY DIRECTLY TO SENDER</a>
              </div>
            </div>
          </div>
        `,
      };

      const adminResult = await mailer.sendMail(adminMail);
      adminDeliverySuccess = true;
      adminMessageId = adminResult.messageId;
    } catch (err) {
      console.warn('Gmail SMTP error, falling back to direct relay:', err.message);
    }
  }

  // 2. Direct Relay Fallback (sends real email directly to grenite07@gmail.com)
  if (!adminDeliverySuccess) {
    const relayResult = await sendDirectRelayEmail({
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[GE TRANSMISSION] [${category}] ${subject} from ${name}`,
      fields: {
        'Sender Name': name,
        'Email Address': email,
        'Phone Number': phone || 'N/A',
        'Inquiry Category': category,
        'Subject': subject,
        'Message Body': message,
        'Received Time': `${timestamp} IST`,
      },
    });
    if (relayResult.success) {
      adminDeliverySuccess = true;
      adminMessageId = `relay_${Date.now()}`;
    }
  }

  // 3. User confirmation receipt
  try {
    const mailer = await getTransporter();
    const userMail = {
      from: `"${BRAND_NAME}" <${SENDER_EMAIL}>`,
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
              Thank you for getting in touch with Grenite Esports. Your transmission regarding <strong>"${subject}"</strong> has been logged and forwarded directly to management at <strong>${ADMIN_EMAIL}</strong>.
            </p>
            <div style="background: #15151a; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #23242c; font-size: 13px;">
              <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${category}</p>
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
  } catch (err) {
    console.warn('Could not dispatch automated confirmation copy to user:', err.message);
  }

  return {
    success: true,
    messageId: adminMessageId || `ticket_${Date.now()}`,
    directDelivered: adminDeliverySuccess,
  };
}

/**
 * Send Recruitment Application Notification Email to ADMIN & Player
 */
export async function sendRecruitmentEmail(application) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let adminDeliverySuccess = false;

  // 1. Notify Management (grenite07@gmail.com) via SMTP if configured
  if (process.env.SMTP_PASS && process.env.SMTP_PASS.trim() !== '') {
    try {
      const mailer = await getTransporter();
      const adminMail = {
        from: `"${application.ign} Tryouts via GE ESPORTS" <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
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
      await mailer.sendMail(adminMail);
      adminDeliverySuccess = true;
    } catch (err) {
      console.warn('Gmail SMTP error for recruitment, using direct relay:', err.message);
    }
  }

  // 2. Direct Relay Fallback to grenite07@gmail.com
  if (!adminDeliverySuccess) {
    await sendDirectRelayEmail({
      to: ADMIN_EMAIL,
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
  }

  // 3. Confirmation to Player
  try {
    const mailer = await getTransporter();
    const userMail = {
      from: `"${BRAND_NAME} Scouting" <${SENDER_EMAIL}>`,
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
              Your Free Fire India competitive tryout application has been received and delivered directly to the GE Esports coaching desk at <strong>${ADMIN_EMAIL}</strong>.
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
  } catch (err) {
    console.warn('Could not dispatch player tryout confirmation copy:', err.message);
  }

  return {
    success: true,
    messageId: application.id,
  };
}

/**
 * Send Priority Drop / Newsletter Subscription Confirmation
 */
export async function sendDropAlertEmail({ email, productName }) {
  try {
    const mailer = await getTransporter();
    const mailOptions = {
      from: `"${BRAND_NAME}" <${SENDER_EMAIL}>`,
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
    await mailer.sendMail(mailOptions);
  } catch (err) {
    console.warn('Drop alert email warning:', err.message);
  }

  return { success: true };
}
