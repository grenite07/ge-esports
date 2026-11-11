import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2, Loader2, Sparkles, Phone, User, MessageSquare, ExternalLink, Copy } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, contactPrefill, sendEmailMessage } = useEsports();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Sponsorship & Brand Partnership',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Apply prefill when opened
  useEffect(() => {
    if (isContactModalOpen) {
      setTicketId(null);
      setErrors({});
      if (contactPrefill.category) {
        setFormData((prev) => ({ ...prev, category: contactPrefill.category! }));
      }
      if (contactPrefill.subject) {
        setFormData((prev) => ({ ...prev, subject: contactPrefill.subject! }));
      }
    }
  }, [isContactModalOpen, contactPrefill]);

  if (!isContactModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'A valid email address is required';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject line is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters describing your inquiry';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await sendEmailMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
      });

      if (res.success) {
        setTicketId(res.ticketId);
        // Reset form fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'Sponsorship & Brand Partnership',
          subject: '',
          message: '',
          honeypot: '',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mailtoUrl = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    `[${formData.category || 'Inquiry'}] ${formData.subject || 'GE ESPORTS Contact'}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsContactModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-[0_0_60px_rgba(7,91,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#26213D] bg-[#08060D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#075BFF]/20 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-black text-white text-base sm:text-lg tracking-wider">
                  GE ESPORTS TRANSMISSION DESK
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              </div>
              <div className="flex items-center gap-2 font-mono-code text-[11px] text-[#8E8A9F]">
                <span>OFFICIAL INBOX:</span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-[#00F0FF] hover:underline font-bold"
                >
                  {BRAND.email}
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-2 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close contact modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {ticketId ? (
            /* Success confirmation screen */
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="sub-header-pill text-[10px]">TRANSMISSION LOGGED</span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  MESSAGE DISPATCHED
                </h3>
                <p className="text-sm text-[#DDE1E8]/80 font-light max-w-md mx-auto">
                  Your message has been received by the GE Esports management team and routed to{' '}
                  <strong className="text-white">{BRAND.email}</strong>.
                </p>

                <div className="pt-3">
                  <span className="font-mono-code text-xs text-[#888888] block mb-1">
                    REFERENCE TRACKING TICKET:
                  </span>
                  <div className="inline-flex items-center gap-2 p-3 rounded-lg bg-black border border-[#23242c] font-mono-code text-base font-bold text-[#075BFF]">
                    <span>{ticketId}</span>
                    <button
                      onClick={handleCopyTicket}
                      className="p-1 text-[#888888] hover:text-white transition-colors"
                      title="Copy Reference ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && (
                    <span className="block text-xs font-mono-code text-emerald-400 mt-1">
                      Copied to clipboard!
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#888888] font-light max-w-md mx-auto pt-2">
                  Our official desk operates Monday through Saturday. You will receive a direct reply to your email address within 24 hours.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`mailto:${BRAND.email}?subject=Follow-up on Ticket ${ticketId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-code text-xs border border-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#075BFF]" />
                  <span>DIRECT EMAIL CLIENT</span>
                </a>

                <button
                  onClick={() => setTicketId(null)}
                  className="px-5 py-2.5 rounded-lg bg-[#075BFF] hover:bg-[#1a6cff] text-white font-mono-code text-xs font-bold uppercase transition-colors shadow-lg"
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <input
                type="text"
                name="user_trap"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="p-3.5 rounded-xl bg-[#111116] border border-[#23242c] flex items-center justify-between text-xs font-mono-code text-[#888888]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#075BFF]" />
                  <span>DIRECT DISPATCH TO MANAGEMENT DESK</span>
                </div>
                <span className="text-[#075BFF] font-bold">LIVE RELAY</span>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono-code text-xs text-[#DDE1E8] uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#075BFF]" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aryan Verma"
                    className={`w-full bg-black border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500' : 'border-[#23242c] focus:border-[#075BFF]'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] font-mono-code text-red-400 block">{errors.name}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-mono-code text-xs text-[#DDE1E8] uppercase flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#075BFF]" />
                    <span>Your Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. yourname@gmail.com"
                    className={`w-full bg-black border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-[#23242c] focus:border-[#075BFF]'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] font-mono-code text-red-400 block">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Phone & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono-code text-xs text-[#DDE1E8] uppercase flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#075BFF]" />
                    <span>Phone / WhatsApp (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black border border-[#23242c] focus:border-[#075BFF] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono-code text-xs text-[#DDE1E8] uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#075BFF]" />
                    <span>Inquiry Category *</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-[#23242c] focus:border-[#075BFF] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="Sponsorship & Brand Partnership">Sponsorship &amp; Brand Partnership</option>
                    <option value="Scrims & Tournament Match Requests">Scrims &amp; Match Invitation</option>
                    <option value="Player Scouting & Tryout Inquiries">Player Scouting / Tryouts</option>
                    <option value="Media, Press & Interview Requests">Media &amp; Press Inquiry</option>
                    <option value="Merchandise & Order Inquiries">Merchandise &amp; Gear Drop</option>
                    <option value="General Support & Queries">General Inquiries</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="font-mono-code text-xs text-[#DDE1E8] uppercase flex items-center gap-1.5">
                  <span>Subject Line *</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Partnership Proposal for Tier 1 Free Fire Series"
                  className={`w-full bg-black border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                    errors.subject ? 'border-red-500' : 'border-[#23242c] focus:border-[#075BFF]'
                  }`}
                />
                {errors.subject && (
                  <span className="text-[11px] font-mono-code text-red-400 block">{errors.subject}</span>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono-code text-xs text-[#DDE1E8] uppercase">
                    Your Detailed Message *
                  </label>
                  <span className="text-[11px] font-mono-code text-[#666]">
                    {formData.message.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your proposal, match dates, tournament details, or inquiry..."
                  className={`w-full bg-black border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-[#23242c] focus:border-[#075BFF]'
                  }`}
                />
                {errors.message && (
                  <span className="text-[11px] font-mono-code text-red-400 block">{errors.message}</span>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={mailtoUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-code text-xs border border-white/10 transition-colors"
                  title="Click to open pre-filled email in Gmail or Outlook"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#075BFF]" />
                  <span>OPEN IN GMAIL / MAIL APP</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#075BFF] hover:bg-[#1a6cff] text-white font-mono-code text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(7,91,255,0.35)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>DISPATCHING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMIT MESSAGE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
