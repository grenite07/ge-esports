import React from 'react';
import { X, Shield, Download, Mail } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';

export const LegalModal: React.FC = () => {
  const { legalModalType, setLegalModalType, openContactModal } = useEsports();

  if (!legalModalType) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setLegalModalType(null)}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-[0_0_60px_rgba(7,91,255,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#26213D] bg-[#08060D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#075BFF]/20 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-orbitron font-black text-white text-base sm:text-lg tracking-wider block">
                {legalModalType === 'privacy' && 'CONFIDENTIALITY & PRIVACY POLICY'}
                {legalModalType === 'terms' && 'TERMS OF SERVICE & PARTICIPATION'}
                {legalModalType === 'rules' && 'COMPETITIVE FAIR PLAY CODE & SCRIM RULES'}
                {legalModalType === 'brand' && 'GE ESPORTS OFFICIAL BRAND ASSETS & PALETTE'}
              </span>
              <span className="font-mono-code text-[11px] text-[#8E8A9F]">
                GE ESPORTS // LEGAL &amp; GOVERNANCE COMPLIANCE
              </span>
            </div>
          </div>

          <button
            onClick={() => setLegalModalType(null)}
            className="p-2 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#DDE1E8]/85 leading-relaxed font-light">
          {legalModalType === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white uppercase">1. Scouting & Tryout Data Privacy</h4>
              <p>
                GE ESPORTS (Grenite Esports) respects your privacy and is committed to protecting player credentials. Any personal data submitted through our official recruitment portal—including Free Fire In-Game Name (IGN), Player UID, phone numbers, email addresses, and gameplay highlight footage—is collected strictly for evaluation by authorized coaching and scouting personnel.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">2. No Commercial Sale of Athlete Data</h4>
              <p>
                We do not sell, rent, or distribute scouting files, applicant contacts, or newsletter subscriptions to any third-party advertisers. All records are retained securely on our encrypted server infrastructure.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">3. Contact & Inquiries</h4>
              <p>
                If you wish to request deletion or modification of your scouting file or correspondence, contact our data administrator directly at{' '}
                <a href={`mailto:${BRAND.email}`} className="text-[#075BFF] font-semibold underline">
                  {BRAND.email}
                </a>.
              </p>
            </div>
          )}

          {legalModalType === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white uppercase">1. Representation & Intellectual Property</h4>
              <p>
                The GE ESPORTS logos, jersey crest, tagline ("Unleash The Storm"), audio-visual tournament montages, and apparel designs are proprietary trademarks of Grenite Esports. Unauthorized commercial reproduction is prohibited.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">2. Roster Representation & Player Welfare</h4>
              <p>
                Signed athletes under Grenite Esports are bound by competitive contracts guaranteeing fair stipend distribution, tournament prize share transparency, and equipment access.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">3. Official Communications</h4>
              <p>
                Official invitations and roster confirmations are exclusively transmitted via verified accounts: Instagram{' '}
                <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="text-[#075BFF] underline">
                  {BRAND.instagramHandle}
                </a>{' '}
                or email <strong className="text-white">{BRAND.email}</strong>.
              </p>
            </div>
          )}

          {legalModalType === 'rules' && (
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white uppercase">1. Zero Tolerance Anti-Cheat Policy</h4>
              <p>
                Grenite Esports strictly enforces an absolute zero-tolerance standard against third-party configuration files, scripts, emulator bypasses, aim-assist modifications, or unauthorized Free Fire client injectors. Any applicant or roster athlete caught violating tournament integrity is permanently blacklisted.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">2. Scrim Conduct & Sportsmanship</h4>
              <p>
                All athletes participating in GE tier scrims must adhere to lobby punctuality, fair zone rotations, non-teaming regulations, and respect toward opposing squads and broadcast commentators.
              </p>

              <h4 className="font-display text-lg font-bold text-white uppercase">3. Disciplinary Action</h4>
              <p>
                Toxic behavior, hate speech, or unsportsmanlike conduct in Discord voice channels or public lobbies results in immediate trial termination.
              </p>
            </div>
          )}

          {legalModalType === 'brand' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-white uppercase">Official Brand Colors</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#075BFF] text-white flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Electric Blue</span>
                    <span className="font-mono-code text-[11px]">#075BFF</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050505] text-white border border-[#23242c] flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Onyx Black</span>
                    <span className="font-mono-code text-[11px]">#050505</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#151515] text-white border border-[#23242c] flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Charcoal Core</span>
                    <span className="font-mono-code text-[11px]">#151515</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#DDE1E8] text-black flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Silver Metallic</span>
                    <span className="font-mono-code text-[11px]">#DDE1E8</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#111114] text-[#888888] border border-[#23242c] flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Muted Gunmetal</span>
                    <span className="font-mono-code text-[11px]">#888888</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white text-black flex flex-col justify-between h-20">
                    <span className="font-bold text-xs uppercase">Pure White</span>
                    <span className="font-mono-code text-[11px]">#FFFFFF</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111114] border border-[#23242c] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src="/Logo GE.jpeg" alt="Logo" className="w-12 h-12 rounded-lg object-contain border border-[#23242c]" />
                  <div>
                    <span className="font-display font-bold text-white block">Official Vector / High-Res Crest</span>
                    <span className="font-mono-code text-xs text-[#888888]">Format: JPEG (300 DPI Master Asset)</span>
                  </div>
                </div>
                <a
                  href="/Logo GE.jpeg"
                  download="GE_ESPORTS_OFFICIAL_LOGO.jpeg"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#075BFF] hover:bg-[#1a6cff] text-white font-mono-code text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#23242c] bg-[#111116] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono-code text-xs text-[#888888]">
            <Mail className="w-3.5 h-3.5 text-[#075BFF]" />
            <span>Questions?</span>
            <a href={`mailto:${BRAND.email}`} className="text-white hover:text-[#075BFF] font-medium">
              {BRAND.email}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLegalModalType(null);
                openContactModal('General Support & Queries', 'Legal or Governance Query');
              }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-code text-xs transition-colors"
            >
              CONTACT DESK
            </button>
            <button
              onClick={() => setLegalModalType(null)}
              className="px-5 py-2 rounded-lg bg-[#075BFF] hover:bg-[#1a6cff] text-white font-mono-code text-xs font-bold transition-colors"
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
