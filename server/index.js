import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readData, writeData } from './storage.js';
import { sendContactEmail, sendRecruitmentEmail, sendDropAlertEmail } from './emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares — Allow Vercel frontend + localhost
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,        // Set in Render env: e.g. https://ge-esports.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return cb(null, true);
    // Also allow any *.vercel.app preview URLs
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(null, true); // permissive for now — tighten later if needed
  },
  credentials: true,
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'GE ESPORTS API & Mail Relay',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * CONTACT & EMAIL INQUIRY ENDPOINT
 * Dispatches real email notification and logs message persistently
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, category, message, phone, honeypot } = req.body;

    // Bot trap
    if (honeypot) {
      return res.status(400).json({ error: 'Bot submission detected.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message body are required.' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const messageId = `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newMessage = {
      id: messageId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      category: category || 'General Inquiry',
      message: message.trim(),
      timestamp,
      isRead: false,
      replied: false,
    };

    // 1. Save to database
    const messages = readData('messages.json', []);
    messages.unshift(newMessage);
    writeData('messages.json', messages);

    // 2. Dispatch real email via Nodemailer
    let emailResult = { success: false };
    try {
      emailResult = await sendContactEmail(newMessage);
    } catch (mailErr) {
      console.error('Email dispatch error (handled):', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully transmitted and logged.',
      ticketId: messageId,
      timestamp,
      emailDispatched: emailResult.success,
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ error: 'Failed to process transmission. Please try again or email contact@greniteesports.com' });
  }
});

/**
 * GET ALL CONTACT MESSAGES (For Admin CMS)
 */
app.get('/api/contact/messages', (req, res) => {
  const messages = readData('messages.json', []);
  res.json({ success: true, count: messages.length, messages });
});

/**
 * MARK MESSAGE AS READ / REPLIED
 */
app.patch('/api/contact/messages/:id/read', (req, res) => {
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
 * DELETE MESSAGE
 */
app.delete('/api/contact/messages/:id', (req, res) => {
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

/**
 * RECRUITMENT APPLICATION SUBMISSION
 */
app.post('/api/recruitment', async (req, res) => {
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
    } = req.body;

    if (honeypot) {
      return res.status(400).json({ error: 'Spam detected.' });
    }

    if (!fullName || !ign || !uid || !gameplayVideoUrl || !contactEmail || !contactPhone) {
      return res.status(400).json({ error: 'Missing mandatory tryout fields.' });
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
      contactEmail: contactEmail.trim(),
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
      console.error('Tryout email notification error (handled):', mailErr.message);
    }

    res.status(201).json({
      success: true,
      referenceId: appId,
      message: 'Scouting application logged and confirmation email transmitted.',
      application,
      emailDispatched: emailResult.success,
    });
  } catch (error) {
    console.error('Error processing recruitment application:', error);
    res.status(500).json({ error: 'Failed to process application. Please retry.' });
  }
});

/**
 * GET RECRUITMENT APPLICATIONS (For Admin CMS)
 */
app.get('/api/recruitment/applications', (req, res) => {
  const applications = readData('applications.json', []);
  res.json({ success: true, count: applications.length, applications });
});

/**
 * UPDATE APPLICATION STATUS
 */
app.patch('/api/recruitment/applications/:id/status', (req, res) => {
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

/**
 * MERCH DROP NOTIFICATION / NEWSLETTER
 */
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, productName } = req.body;

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

    // Dispatch confirmation email
    try {
      await sendDropAlertEmail({ email, productName });
    } catch (e) {
      console.warn('Newsletter confirmation email issue (handled):', e.message);
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

/**
 * ADMIN LOGIN CHECK
 */
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const ADMIN_PIN = process.env.ADMIN_PIN;

  if (
    ADMIN_PIN &&
    typeof pin === 'string' &&
    pin.trim() === ADMIN_PIN
  ) {
    return res.json({ success: true, token: 'ge_admin_verified_session' });
  }

  res.status(401).json({ success: false, error: 'Invalid Staff Access Code.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ GE ESPORTS BACKEND API ACTIVE ON PORT ${PORT}`);
  console.log(`📡 Endpoints: /api/contact, /api/recruitment, /api/newsletter`);
  console.log(`===============================================`);
});
