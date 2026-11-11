import React, { useState } from 'react';
import { Shield, Send, CheckCircle2, Loader2, Video, User, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';
import type { PlayerRole } from '../types';

export const JoinSection: React.FC = () => {
  const { submitApplication, sendEmailMessage, setLegalModalType } = useEsports();
  const [activeTab, setActiveTab] = useState<'tryouts' | 'contact'>('tryouts');

  // Tryouts form state
  const [formData, setFormData] = useState({
    fullName: '',
    ign: '',
    uid: '',
    preferredRole: 'Rusher' as PlayerRole,
    competitiveExperience: '',
    previousTeams: '',
    gameplayVideoUrl: '',
    contactEmail: '',
    contactPhone: '',
    discordId: '',
    privacyConsent: false,
    honeypot: '',
  });

  // Contact form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Sponsorship & Brand Partnership',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [tryoutErrors, setTryoutErrors] = useState<Record<string, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isSubmittingTryouts, setIsSubmittingTryouts] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [contactTicket, setContactTicket] = useState<string | null>(null);

  // Validate Tryout form
  const validateTryouts = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!formData.ign.trim()) errs.ign = 'Competitive In-Game Name (IGN) is required';

    if (!formData.uid.trim()) {
      errs.uid = 'Free Fire UID is required';
    } else if (!/^\d{8,12}$/.test(formData.uid.trim())) {
      errs.uid = 'Free Fire UID must contain 8 to 12 numerical digits';
    }

    if (!formData.gameplayVideoUrl.trim()) {
      errs.gameplayVideoUrl = 'A gameplay highlight reel URL (YouTube/Drive/VOD) is mandatory';
    } else if (!formData.gameplayVideoUrl.startsWith('http://') && !formData.gameplayVideoUrl.startsWith('https://')) {
      errs.gameplayVideoUrl = 'Please provide a valid web URL starting with https://';
    }

    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      errs.contactEmail = 'A valid contact email address is required';
    }

    if (!formData.contactPhone.trim() || formData.contactPhone.length < 8) {
      errs.contactPhone = 'A valid phone or WhatsApp number is required';
    }

    if (!formData.privacyConsent) {
      errs.privacyConsent = 'You must accept the player evaluation and privacy terms';
    }

    setTryoutErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTryoutsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot !== '') return;
    if (!validateTryouts()) return;

    setIsSubmittingTryouts(true);
    try {
      const ref = await submitApplication({
        fullName: formData.fullName,
        ign: formData.ign,
        uid: formData.uid,
        preferredRole: formData.preferredRole,
        competitiveExperience: formData.competitiveExperience,
        previousTeams: formData.previousTeams,
        gameplayVideoUrl: formData.gameplayVideoUrl,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        discordId: formData.discordId,
      });

      setSubmittedRef(ref);
      setFormData({
        fullName: '',
        ign: '',
        uid: '',
        preferredRole: 'Rusher',
        competitiveExperience: '',
        previousTeams: '',
        gameplayVideoUrl: '',
        contactEmail: '',
        contactPhone: '',
        discordId: '',
        privacyConsent: false,
        honeypot: '',
      });
    } finally {
      setIsSubmittingTryouts(false);
    }
  };

  // Validate Contact form
  const validateContact = () => {
    const errs: Record<string, string> = {};
    if (!contactData.name.trim()) errs.name = 'Full name is required';
    if (!contactData.email.trim() || !contactData.email.includes('@')) {
      errs.email = 'A valid email address is required';
    }
    if (!contactData.subject.trim()) errs.subject = 'Subject line is required';
    if (!contactData.message.trim() || contactData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters describing your inquiry';
    }
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactData.honeypot) return;
    if (!validateContact()) return;

    setIsSubmittingContact(true);
    try {
      const res = await sendEmailMessage({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        category: contactData.category,
        subject: contactData.subject,
        message: contactData.message,
      });

      if (res.success) {
        setContactTicket(res.ticketId);
        setContactData({
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
      setIsSubmittingContact(false);
    }
  };

  return (
    <section id="join" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D] scroll-mt-10">
      <div id="contact" className="relative -top-24" />

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-[#075BFF]/10 via-[#8B5CF6]/15 to-[#00F0FF]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="sub-header-pill">
            <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>TALENT RECRUITMENT &amp; COMMUNICATIONS</span>
          </div>

          <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            CONNECT WITH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">
              GRENITE ESPORTS.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl mx-auto">
            Apply for our elite Free Fire India competitive roster, arrange tournament scrim bookings, or propose commercial sponsorships.
          </p>

          {/* Quick Contact Badge with Official Email */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#120F1F] border border-[#26213D] hover:border-[#00F0FF] transition-colors text-xs font-mono-code text-[#DDE1E8] group"
            >
              <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>OFFICIAL DESK:</span>
              <span className="text-white font-bold group-hover:text-[#00F0FF] transition-colors">
                {BRAND.email}
              </span>
            </a>

            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#120F1F] border border-[#26213D] hover:border-[#8B5CF6] transition-colors text-xs font-mono-code text-[#8E8A9F] hover:text-white"
            >
              <span>INSTAGRAM: {BRAND.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Tab Switcher: Tryouts vs Email Message Desk */}
        <div className="flex items-center justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-[#120F1F] border border-[#26213D] inline-flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tryouts')}
              className={`px-6 py-3 rounded-xl font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'tryouts'
                  ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(7,91,255,0.4)]'
                  : 'text-[#8E8A9F] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-[#00F0FF]" />
              <span>PLAYER TRYOUTS</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 rounded-xl font-orbitron text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(7,91,255,0.4)]'
                  : 'text-[#8E8A9F] hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-[#00F0FF]" />
              <span>OFFICIAL EMAIL DESK</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PLAYER TRYOUTS */}
        {activeTab === 'tryouts' && (
          <div>
            {submittedRef ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#120F1F] border border-[#00F0FF]/50 text-center space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center mx-auto border border-[#00F0FF]/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="sub-header-pill text-[11px]">APPLICATION LOGGED</span>
                  <h3 className="font-orbitron text-3xl font-black text-white uppercase tracking-tight">
                    SCOUTING FILE CREATED
                  </h3>
                  <p className="text-sm text-[#DDE1E8]/80 font-rajdhani max-w-md mx-auto">
                    Your credentials and gameplay clip have been registered under Scouting Reference:
                  </p>
                  <div className="p-3 rounded-xl bg-[#08060D] border border-[#26213D] inline-block font-orbitron text-lg font-bold text-[#00F0FF] tracking-wider my-2">
                    {submittedRef}
                  </div>
                  <p className="text-xs text-[#8E8A9F] font-rajdhani max-w-md mx-auto">
                    A confirmation email was dispatched to your inbox. Our talent manager reviews submissions weekly.
                  </p>
                </div>

                <button
                  onClick={() => setSubmittedRef(null)}
                  className="px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  SUBMIT ANOTHER TRYOUT
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleTryoutsSubmit}
                className="p-6 sm:p-10 rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-2xl space-y-6"
                noValidate
              >
                <input
                  type="text"
                  name="website_url"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Row 1: Full Name & IGN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Full Legal Name *</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aryan Sharma"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        tryoutErrors.fullName ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {tryoutErrors.fullName && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.fullName}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Free Fire IGN (In-Game Name) *</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ign}
                      onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                      placeholder="e.g. GE_VORTEX"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        tryoutErrors.ign ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {tryoutErrors.ign && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.ign}</span>
                    )}
                  </div>
                </div>

                {/* Row 2: UID & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider">
                      Free Fire UID (8–12 Digits) *
                    </label>
                    <input
                      type="text"
                      value={formData.uid}
                      onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                      placeholder="e.g. 1928471203"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        tryoutErrors.uid ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {tryoutErrors.uid && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.uid}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider">
                      Primary Competitive Role *
                    </label>
                    <select
                      value={formData.preferredRole}
                      onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value as PlayerRole })}
                      className="w-full bg-[#08060D] border border-[#26213D] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="Primary Rusher">Primary Rusher (Entry Frag / Breaker)</option>
                      <option value="Secondary Rusher">Secondary Rusher (Crossfire / Re-Frag)</option>
                      <option value="IGL">In-Game Leader (Tactical Shot-Caller)</option>
                      <option value="Sniper">Sniper (Long-Range Tag / AWM)</option>
                      <option value="Support">Support (Utility Anchor)</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Gameplay URL */}
                <div className="space-y-2">
                  <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Gameplay Highlight Reel URL *</span>
                  </label>
                  <input
                    type="url"
                    value={formData.gameplayVideoUrl}
                    onChange={(e) => setFormData({ ...formData, gameplayVideoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or Google Drive / VOD link"
                    className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                      tryoutErrors.gameplayVideoUrl ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                    }`}
                  />
                  {tryoutErrors.gameplayVideoUrl && (
                    <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.gameplayVideoUrl}</span>
                  )}
                </div>

                {/* Row 4: Contact Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Contact Email *</span>
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="player@gmail.com"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        tryoutErrors.contactEmail ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {tryoutErrors.contactEmail && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.contactEmail}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        tryoutErrors.contactPhone ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {tryoutErrors.contactPhone && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{tryoutErrors.contactPhone}</span>
                    )}
                  </div>
                </div>

                {/* Privacy checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.privacyConsent}
                      onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-[#26213D] bg-black text-[#00F0FF] focus:ring-0"
                    />
                    <span className="text-xs text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
                      I certify that all gameplay clips are authentic and played without third-party modifications. I accept the{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModalType('privacy')}
                        className="text-[#00F0FF] hover:underline"
                      >
                        GE Scouting Data Privacy Terms
                      </button>.
                    </span>
                  </label>
                  {tryoutErrors.privacyConsent && (
                    <span className="text-[11px] font-mono-code text-red-400 block mt-1">
                      {tryoutErrors.privacyConsent}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingTryouts}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-[#075BFF] via-[#1a6cff] to-[#8B5CF6] hover:brightness-110 text-white font-orbitron text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(7,91,255,0.4)] disabled:opacity-50"
                >
                  {isSubmittingTryouts ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>LOGGING SCOUTING FILE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#00F0FF]" />
                      <span>SUBMIT TRYOUT APPLICATION</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: OFFICIAL EMAIL MESSAGE TRANSMISSION DESK */}
        {activeTab === 'contact' && (
          <div>
            {contactTicket ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#120F1F] border border-[#00F0FF]/50 text-center space-y-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="sub-header-pill text-[11px]">TRANSMISSION SUCCESSFUL</span>
                  <h3 className="font-orbitron text-3xl font-black text-white uppercase tracking-tight">
                    MESSAGE DELIVERED
                  </h3>
                  <p className="text-sm text-[#DDE1E8]/80 font-rajdhani max-w-md mx-auto">
                    Your inquiry has been relayed to GE Esports management at{' '}
                    <strong className="text-white">{BRAND.email}</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-[#08060D] border border-[#26213D] inline-block font-orbitron text-lg font-bold text-[#00F0FF] tracking-wider my-2">
                    {contactTicket}
                  </div>
                  <p className="text-xs text-[#8E8A9F] font-rajdhani max-w-md mx-auto">
                    A confirmation receipt was sent to your email. Expect a response within 24 business hours.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:${BRAND.email}?subject=Follow-up on Ticket ${contactTicket}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#00F0FF]" />
                    <span>OPEN IN EMAIL CLIENT</span>
                  </a>

                  <button
                    onClick={() => setContactTicket(null)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="p-6 sm:p-10 rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-2xl space-y-6"
                noValidate
              >
                <input
                  type="text"
                  name="bot_field"
                  value={contactData.honeypot}
                  onChange={(e) => setContactData({ ...contactData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        contactErrors.name ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {contactErrors.name && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{contactErrors.name}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Your Email *</span>
                    </label>
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com"
                      className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                        contactErrors.email ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                      }`}
                    />
                    {contactErrors.email && (
                      <span className="text-[11px] font-mono-code text-red-400 block">{contactErrors.email}</span>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Phone / WhatsApp (Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#08060D] border border-[#26213D] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Inquiry Category *</span>
                    </label>
                    <select
                      value={contactData.category}
                      onChange={(e) => setContactData({ ...contactData, category: e.target.value })}
                      className="w-full bg-[#08060D] border border-[#26213D] focus:border-[#00F0FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
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
                <div className="space-y-2">
                  <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    placeholder="e.g. Scrimmage Invitation for Saturday Tier-1 Lobby"
                    className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${
                      contactErrors.subject ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                    }`}
                  />
                  {contactErrors.subject && (
                    <span className="text-[11px] font-mono-code text-red-400 block">{contactErrors.subject}</span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="font-orbitron text-xs text-[#DDE1E8] uppercase tracking-wider">
                    Message Body *
                  </label>
                  <textarea
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Please include proposal details, dates, or questions..."
                    className={`w-full bg-[#08060D] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors resize-none ${
                      contactErrors.message ? 'border-red-500' : 'border-[#26213D] focus:border-[#00F0FF]'
                    }`}
                  />
                  {contactErrors.message && (
                    <span className="text-[11px] font-mono-code text-red-400 block">{contactErrors.message}</span>
                  )}
                </div>

                {/* Direct buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <a
                    href={`mailto:${BRAND.email}?subject=${encodeURIComponent(contactData.subject || 'GE ESPORTS Inquiry')}&body=${encodeURIComponent(contactData.message || '')}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-orbitron text-xs border border-white/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>OPEN IN GMAIL APP</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] hover:brightness-110 text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(7,91,255,0.4)] disabled:opacity-50"
                  >
                    {isSubmittingContact ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#00F0FF]" />
                        <span>TRANSMIT MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
