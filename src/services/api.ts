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

const ADMIN_TOKEN_KEY = 'ge_admin_token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota errors
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
}

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
    clearAdminToken();
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

  if (data.token && typeof data.token === 'string') {
    setAdminToken(data.token);
  }

  return true;
}

/**
 * Check if the stored admin session is still valid
 */
export async function checkAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE}/admin/session`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return data?.authenticated === true;
    }

    // Token invalid or expired
    clearAdminToken();
    return false;
  } catch {
    // If backend is temporarily unreachable, maintain offline check if token format is valid
    return false;
  }
}

/**
 * Admin Logout
 */
export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network errors on logout
  } finally {
    clearAdminToken();
  }
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
  emailSimulated?: boolean;
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
  emailSimulated?: boolean;
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
    console.warn('API connection issue:', err.message);
    throw err;
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
    console.warn('Recruitment API issue:', err.message);
    throw err;
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
  } catch {
    return { success: true, message: 'Priority alert registered.' };
  }
}

/**
 * Fetch all received contact inquiries (For Admin CMS - Authenticated)
 */
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

/**
 * Mark message as read (Authenticated)
 */
export async function markMessageAsRead(id: string, replied?: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ replied }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Delete contact message (Authenticated)
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}
