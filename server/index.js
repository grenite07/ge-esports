import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { timingSafeEqual, createHmac } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readData, writeData } from './storage.js';
import {
  sendContactEmail,
  sendRecruitmentEmail,
  sendDropAlertEmail,
  getEmailConfig,
  verifySmtpConnection,
} from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether started from workspace root, server/, or container
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'ge_esports_secret_jwt_sign_key_2026';

// Middlewares — Allow Vercel frontend + localhost
const configuredFrontend = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null;
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  configuredFrontend,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return cb(null, true);
    // Also allow any *.vercel.app preview URLs
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(null, true); // permissive for now
  },
  credentials: true,
}));
app.use(express.json());

// Request logger (safe: never logs passwords or authorization tokens)
app.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* ========================================================================== */
/* TOKEN & AUTHENTICATION UTILITIES                                          */
/* ========================================================================== */

/**
 * Generate a cryptographically signed HMAC-SHA256 session token (JWT structure)
 */
function createAdminToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    iat: now,
    exp: now + (24 * 60 * 60), // 24 hours validity
  })).toString('base64url');

  const signature = createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify HMAC-SHA256 session token
 */
function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null; // Expired
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract auth token from Authorization header or cookie
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.headers['x-admin-token']) {
    return String(req.headers['x-admin-token']).trim();
  }
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

/**
 * Admin authorization protection middleware
 */
function requireAdmin(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required.',
    });
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired admin session token.',
    });
  }

  req.admin = payload;
  next();
}

/**
 * Constant-time string comparison helper to prevent timing attacks
 */
function safeCompare(a, b) {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/* ========================================================================== */
/* HEALTH & DIAGNOSTIC ENDPOINTS                                             */
/* ========================================================================== */

app.get(['/api/health', '/health'], (req, res) => {
  const emailCfg = getEmailConfig();
  res.json({
    status: 'ONLINE',
    service: 'GE ESPORTS API & Mail Relay',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    adminAccessConfigured: Boolean(process.env.ADMIN_PIN && process.env.ADMIN_PIN.trim()),
    smtpConfigured: Boolean(emailCfg.pass),
    smtpHost: emailCfg.host,
    smtpPort: emailCfg.port,
    smtpSecure: emailCfg.secure,
    senderEmail: emailCfg.senderEmail,
    adminEmail: emailCfg.adminEmail,
  });
});

app.get(['/api/health/smtp', '/health/smtp'], async (req, res) => {
  try {
    const diag = await verifySmtpConnection();
    res.json(diag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================================================== */
/* ADMIN AUTHENTICATION ENDPOINTS                                             */
/* ========================================================================== */

/**
 * Login / Verify Admin PIN
 * Validates against process.env.ADMIN_PIN in constant time and returns signed JWT
 */
app.post(['/api/verify-admin', '/verify-admin', '/api/admin/login'], (req, res) => {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin || adminPin.trim() === '') {
    return res.status(503).json({
      success: false,
      error: 'Staff access is not configured on the server (ADMIN_PIN environment variable is missing).',
    });
  }

  const pin = req.body?.pin;
  if (pin === undefined || pin === null) {
    return res.status(400).json({ success: false, error: 'Staff PIN is required.' });
  }

  const submittedStr = String(pin).trim();
  const configuredStr = String(adminPin).trim();

  if (!submittedStr) {
    return res.status(401).json({ success: false, error: 'Incorrect Staff Access PIN.' });
  }

  // Allow exact match or case-insensitive match for alphanumeric PINs
  const isValid =
    safeCompare(submittedStr, configuredStr) ||
    safeCompare(submittedStr.toUpperCase(), configuredStr.toUpperCase());

  if (isValid) {
    const token = createAdminToken();
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      message: 'Authentication successful.',
    });
  }

  return res.status(401).json({ success: false, error: 'Incorrect Staff Access PIN.' });
});

/**
 * Verify active session persistence
 */
app.get(['/api/admin/session', '/api/verify-admin/session'], (req, res) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, authenticated: false });
  }

  return res.json({ success: true, authenticated: true });
});

/**
 * Admin Logout
 */
app.post(['/api/admin/logout', '/api/verify-admin/logout'], (req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

/* ========================================================================== */
/* CONTACT INQUIRY ENDPOINT (PUBLIC SUBMIT, PROTECTED READ/MANAGE)           */
/* ========================================================================== */

app.post(['/api/contact', '/contact'], async (req, res) => {
  try {
    const { name, email, subject, category, message, phone, honeypot } = req.body || {};

    // Bot trap
    if (honeypot) {
      return res.status(400).json({ error: 'Bot submission detected.' });
    }

    // Validation
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanMessage = (message || '').trim();
    const cleanSubject = (subject || 'General Inquiry').trim();
    const cleanCategory = (category || 'General Inquiry').trim();
    const cleanPhone = (phone || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'A valid name (at least 2 characters) is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters describing your inquiry.' });
    }

    const messageId = `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newMessage = {
      id: messageId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      category: cleanCategory,
      message: cleanMessage,
      timestamp,
      isRead: false,
      replied: false,
    };

    // 1. Save to database persistently
    const messages = readData('messages.json', []);
    messages.unshift(newMessage);
    writeData('messages.json', messages);

    // 2. Dispatch real email via Nodemailer
    let emailResult = { success: false };
    try {
      emailResult = await sendContactEmail(newMessage);
    } catch (mailErr) {
      console.error('[CONTACT EMAIL HANDLED ERROR]:', mailErr.message);
      emailResult = { success: false, error: mailErr.message };
    }

    res.status(201).json({
      success: true,
      message: emailResult.success
        ? 'Your inquiry has been successfully transmitted and delivered.'
        : 'Your inquiry has been safely logged, but email transmission encountered an issue.',
      ticketId: messageId,
      timestamp,
      emailDispatched: Boolean(emailResult.success),
      emailSimulated: Boolean(emailResult.simulated),
      emailError: emailResult.error || null,
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ error: 'Failed to process transmission. Please try again or email contact@greniteesports.com' });
  }
});

/**
 * GET ALL CONTACT MESSAGES (PROTECTED - Requires Admin Token)
 */
app.get(['/api/contact/messages', '/contact/messages'], requireAdmin, (req, res) => {
  const messages = readData('messages.json', []);
  res.json({ success: true, count: messages.length, messages });
});

/**
 * MARK MESSAGE AS READ / REPLIED (PROTECTED - Requires Admin Token)
 */
app.patch(['/api/contact/messages/:id/read', '/contact/messages/:id/read'], requireAdmin, (req, res) => {
  const { id } = req.params;
  const messages = readData('messages.json', []);
  const idx = messages.findIndex((m) => m.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages[idx].isRead = true;
  if (req.body.replied !== undefined) {
    messages[idx].replied = req.body.replied;
  }
  writeData('messages.json', messages);

  res.json({ success: true, message: messages[idx] });
});

/**
 * DELETE MESSAGE (PROTECTED - Requires Admin Token)
 */
app.delete(['/api/contact/messages/:id', '/contact/messages/:id'], requireAdmin, (req, res) => {
  const { id } = req.params;
  let messages = readData('messages.json', []);
  const initialLength = messages.length;
  messages = messages.filter((m) => m.id !== id);

  if (messages.length === initialLength) {
    return res.status(404).json({ error: 'Message not found' });
  }

  writeData('messages.json', messages);
  res.json({ success: true, message: 'Message deleted successfully.' });
});

/* ========================================================================== */
/* RECRUITMENT APPLICATION ENDPOINTS                                          */
/* ========================================================================== */

app.post(['/api/recruitment', '/recruitment'], async (req, res) => {
  try {
    const {
      fullName,
      ign,
      uid,
      preferredRole,
      competitiveExperience,
      previousTeams,
      gameplayVideoUrl,
      contactEmail,
      contactPhone,
      discordId,
      honeypot,
    } = req.body || {};

    if (honeypot) {
      return res.status(400).json({ error: 'Spam detected.' });
    }

    if (!fullName || !ign || !uid || !gameplayVideoUrl || !contactEmail || !contactPhone) {
      return res.status(400).json({ error: 'Missing mandatory tryout fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail.trim())) {
      return res.status(400).json({ error: 'A valid contact email is required.' });
    }

    const appId = `GE-TRYOUT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const application = {
      id: appId,
      fullName: fullName.trim(),
      ign: ign.trim(),
      uid: uid.trim(),
      preferredRole: preferredRole || 'Rusher',
      competitiveExperience: competitiveExperience ? competitiveExperience.trim() : 'Competitive Player',
      previousTeams: previousTeams ? previousTeams.trim() : 'Free Agent',
      gameplayVideoUrl: gameplayVideoUrl.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      discordId: discordId ? discordId.trim() : '',
      timestamp,
      status: 'PENDING REVIEW',
    };

    // 1. Save to database
    const applications = readData('applications.json', []);
    applications.unshift(application);
    writeData('applications.json', applications);

    // 2. Dispatch confirmation email
    let emailResult = { success: false };
    try {
      emailResult = await sendRecruitmentEmail(application);
    } catch (mailErr) {
      console.error('[RECRUITMENT EMAIL HANDLED ERROR]:', mailErr.message);
      emailResult = { success: false, error: mailErr.message };
    }

    res.status(201).json({
      success: true,
      referenceId: appId,
      message: emailResult.success
        ? 'Scouting application logged and confirmation email transmitted.'
        : 'Scouting application logged. Confirmation email could not be delivered.',
      application,
      emailDispatched: Boolean(emailResult.success),
      emailSimulated: Boolean(emailResult.simulated),
      emailError: emailResult.error || null,
    });
  } catch (error) {
    console.error('Error processing recruitment application:', error);
    res.status(500).json({ error: 'Failed to process application. Please retry.' });
  }
});

/**
 * GET RECRUITMENT APPLICATIONS (PROTECTED - Requires Admin Token)
 */
app.get(['/api/recruitment/applications', '/recruitment/applications'], requireAdmin, (req, res) => {
  const applications = readData('applications.json', []);
  res.json({ success: true, count: applications.length, applications });
});

/**
 * UPDATE APPLICATION STATUS (PROTECTED - Requires Admin Token)
 */
app.patch(['/api/recruitment/applications/:id/status', '/recruitment/applications/:id/status'], requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING REVIEW', 'SHORTLISTED', 'CONTACTED', 'ARCHIVED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid application status.' });
  }

  const applications = readData('applications.json', []);
  const idx = applications.findIndex((a) => a.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  applications[idx].status = status;
  writeData('applications.json', applications);

  res.json({ success: true, application: applications[idx] });
});

/* ========================================================================== */
/* NEWSLETTER / DROP ALERTS                                                  */
/* ========================================================================== */

app.post(['/api/newsletter', '/newsletter'], async (req, res) => {
  try {
    const { email, productName } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const subscribers = readData('subscribers.json', []);
    const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      subscribers.push({
        id: `SUB-${Date.now()}`,
        email: email.trim().toLowerCase(),
        productInterest: productName || 'All Drops',
        timestamp: new Date().toISOString(),
      });
      writeData('subscribers.json', subscribers);
    }

    try {
      await sendDropAlertEmail({ email, productName });
    } catch (e) {
      console.warn('[DROP ALERT EMAIL WARN]:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'You have been registered for exclusive priority drop notifications.',
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ error: 'Subscription failed. Please retry.' });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ GE ESPORTS BACKEND API ACTIVE ON PORT ${PORT}`);
  console.log(`📡 Endpoints: /api/contact, /api/recruitment, /api/newsletter, /api/verify-admin`);
  console.log(`🔒 Admin Auth: Protected with HMAC-SHA256 tokens`);
  console.log(`===============================================`);
});
