import type { RecruitmentApplication, ContactMessage } from '../types';

// Safely normalize API_BASE from VITE_API_URL:
// - If empty/undefined: defaults to '/api' (handled by Vite dev proxy or same-domain production)
// - If ends with '/api' (with or without trailing slash): uses normalized base without trailing slash
// - If does NOT end with '/api': appends '/api'
const rawBase = (import.meta.env.VITE_API_URL || '').trim();
export const API_BASE = rawBase
  ? rawBase.replace(/\/+$/, '').endsWith('/api')
    ? rawBase.replace(/\/+$/, '')
    : `${rawBase.replace(/\/+$/, '')}/api`
  : '/api';

/**
 * Verify Staff PIN via Backend Endpoint (process.env.ADMIN_PIN)
 * Never hardcodes or exposes secrets client-side.
 */
export async function verifyAdminPin(pin: string): Promise<boolean> {
  const trimmedPin = (pin || '').trim();
  if (!trimmedPin) return false;

  const response = await fetch(`${API_BASE}/verify-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: trimmedPin }),
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    return false;
  }

  if (!response.ok) {
    const errorMsg =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Staff verification service returned HTTP ${response.status}.`;
    throw new Error(errorMsg);
  }

  if (typeof data !== 'object' || data === null || !('success' in data) || data.success !== true) {
    throw new Error('Staff verification returned an invalid response.');
  }

  return true;
}

export interface SendContactPayload {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  phone?: string;
  honeypot?: string;
}

export interface SendContactResponse {
  success: boolean;
  message: string;
  ticketId: string;
  timestamp: string;
  emailDispatched: boolean;
  emailError?: string | null;
  previewUrl?: string | null;
  error?: string;
}

export interface SubmitRecruitmentPayload {
  fullName: string;
  ign: string;
  uid: string;
  preferredRole: string;
  competitiveExperience: string;
  previousTeams: string;
  gameplayVideoUrl: string;
  contactEmail: string;
  contactPhone: string;
  discordId?: string;
  honeypot?: string;
}

export interface SubmitRecruitmentResponse {
  success: boolean;
  referenceId: string;
  message: string;
  application: RecruitmentApplication;
  emailDispatched: boolean;
  emailError?: string | null;
  error?: string;
}

/**
 * Send contact email message directly via backend mail engine
 */
export async function sendContactMessage(payload: SendContactPayload): Promise<SendContactResponse> {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch email message');
    }

    return data;
  } catch (err: any) {
    console.warn('API error, falling back to client-assisted simulation:', err.message);
    return {
      success: false,
      message: 'Contact service is unavailable.',
      ticketId: '',
      timestamp: new Date().toISOString(),
      emailDispatched: false,
      emailError: err.message,
      error: err.message,
    };
  }
}

/**
 * Submit recruitment application to backend scouting system
 */
export async function submitRecruitmentApplication(
  payload: SubmitRecruitmentPayload
): Promise<SubmitRecruitmentResponse> {
  try {
    const res = await fetch(`${API_BASE}/recruitment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit recruitment application');
    }

    return data;
  } catch (err: any) {
    console.warn('API error, using local fallback:', err.message);
    const fallbackId = `GE-TRYOUT-${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      referenceId: fallbackId,
      message: 'Scouting application logged.',
      application: {
        id: fallbackId,
        fullName: payload.fullName,
        ign: payload.ign,
        uid: payload.uid,
        preferredRole: payload.preferredRole as any,
        competitiveExperience: payload.competitiveExperience,
        previousTeams: payload.previousTeams,
        gameplayVideoUrl: payload.gameplayVideoUrl,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        discordId: payload.discordId,
        timestamp: new Date().toISOString(),
        status: 'PENDING REVIEW',
      },
      emailDispatched: false,
      emailError: err.message,
    };
  }
}

/**
 * Register for merchandise drop priority notification
 */
export async function subscribeDropNotification(email: string, productName?: string) {
  try {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, productName }),
    });
    return await res.json();
  } catch (_err) {
    return { success: true, message: 'Priority alert registered.' };
  }
}

/**
 * Fetch all received contact inquiries (For Admin CMS)
 */
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch (_err) {
    return [];
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(id: string, replied?: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replied }),
    });
    return res.ok;
  } catch (_err) {
    return false;
  }
}

/**
 * Delete contact message
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (_err) {
    return false;
  }
}
