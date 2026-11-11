import React from 'react';
import { ArrowUp, Shield, Lock, Mail, MessageSquare, Download, Sparkles } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';
import { InstagramIcon, YouTubeIcon, XIcon, DiscordIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const { setIsAdminOpen, openContactModal, setLegalModalType } = useEsports();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#08060D] border-t border-[#26213D] text-[#8E8A9F] pt-20 pb-12 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-[#8B5CF6]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/5">
          {/* Brand info (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#8B5CF6]/40 p-1 bg-[#120F1F] shadow-[0_0_15px_rgba(7,91,255,0.3)]">
                <img
                  src="/Logo GE.jpeg"
                  alt="GE Esports Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-orbitron font-black text-white text-lg tracking-wider block">
                  GE ESPORTS
                </span>
                <span className="font-mono-code text-[11px] text-[#8E8A9F] uppercase">
                  {BRAND.fullName} // FREE FIRE INDIA
                </span>
              </div>
            </div>

            <p className="font-orbitron text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6] uppercase tracking-tight">
              {BRAND.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium max-w-sm leading-relaxed">
              Premier competitive Free Fire esports organization representing Indian gaming excellence, relentless tactical shot-calling, and pro athlete incubation.
            </p>

            {/* Official Contact Email Desk */}
            <div className="pt-1 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-mono-code">
                <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[#8E8A9F]">Official Inquiries:</span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-white hover:text-[#00F0FF] transition-colors font-bold"
                >
                  {BRAND.email}
                </a>
              </div>

              <div>
                <button
                  onClick={() => openContactModal('General Support & Queries', 'Inquiry from Footer')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#075BFF]/15 hover:bg-[#075BFF] text-[#00F0FF] hover:text-white border border-[#075BFF]/40 font-orbitron text-xs font-bold uppercase transition-all shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>TRANSMIT EMAIL MESSAGE</span>
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#120F1F] hover:bg-gradient-to-r hover:from-[#E1306C] hover:to-[#FD1D1D] text-white flex items-center justify-center border border-[#26213D] hover:border-transparent transition-all shadow-md"
                aria-label="Instagram @ind_greniteesp"
                title="Instagram @ind_greniteesp"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={BRAND.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#120F1F] hover:bg-red-600 text-white flex items-center justify-center border border-[#26213D] hover:border-transparent transition-all shadow-md"
                aria-label="YouTube Channel"
                title="Official YouTube Channel"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>

              <a
                href={BRAND.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#120F1F] hover:bg-[#5865F2] text-white flex items-center justify-center border border-[#26213D] hover:border-transparent transition-all shadow-md"
                aria-label="Discord Server"
                title="Discord Community"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>

              <a
                href={BRAND.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#120F1F] hover:bg-[#075BFF] text-white flex items-center justify-center border border-[#26213D] hover:border-transparent transition-all shadow-md"
                aria-label="Twitter / X"
                title="Twitter / X"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-orbitron text-xs text-white uppercase tracking-widest block font-bold">
              PORTAL NAVIGATION
            </span>
            <ul className="space-y-2.5 text-xs font-mono-code">
              <li>
                <a href="#home" className="hover:text-[#00F0FF] transition-colors">
                  HOME // 01
                </a>
              </li>
              <li>
                <a href="#3d-experience" className="text-[#00F0FF] font-bold hover:underline transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>3D EXPERIENCE // 02</span>
                </a>
              </li>
              <li>
                <a href="#roster" className="hover:text-[#00F0FF] transition-colors">
                  ROSTER // ATHLETES (8)
                </a>
              </li>
              <li>
                <a href="#matches" className="hover:text-[#00F0FF] transition-colors">
                  TOURNAMENTS &amp; PODIUMS
                </a>
              </li>
              <li>
                <a href="#media" className="hover:text-[#00F0FF] transition-colors">
                  MEDIA // REELS &amp; VODS
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#00F0FF] transition-colors">
                  COLLECTION // APPAREL
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-[#00F0FF] transition-colors">
                  COMMUNITY // SOCIALS
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#00F0FF] transition-colors">
                  ABOUT // ORGANIZATION
                </a>
              </li>
              <li>
                <a href="#join" className="text-[#8B5CF6] hover:underline font-bold">
                  JOIN GE // TRYOUTS →
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Policies (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-orbitron text-xs text-white uppercase tracking-widest block font-bold">
              GOVERNANCE &amp; POLICIES
            </span>
            <div className="p-5 rounded-2xl bg-[#120F1F] border border-[#26213D] space-y-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00F0FF]" />
                <span className="font-orbitron text-xs text-white font-bold uppercase">
                  Free Fire India Active Arm
                </span>
              </div>
              <p className="text-xs text-[#8E8A9F] font-rajdhani leading-relaxed">
                Battle Royale &amp; Clash Squad operations conducted in strict accordance with national competitive guidelines and anti-cheat standards.
              </p>

              {/* Legal interactive modal triggers */}
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-orbitron">
                <button
                  onClick={() => setLegalModalType('privacy')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#08060D] border border-[#26213D] text-[#8E8A9F] hover:text-white hover:border-[#00F0FF] transition-colors"
                >
                  PRIVACY
                </button>
                <button
                  onClick={() => setLegalModalType('terms')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#08060D] border border-[#26213D] text-[#8E8A9F] hover:text-white hover:border-[#00F0FF] transition-colors"
                >
                  TERMS
                </button>
                <button
                  onClick={() => setLegalModalType('rules')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#08060D] border border-[#26213D] text-[#8E8A9F] hover:text-white hover:border-[#00F0FF] transition-colors"
                >
                  FAIR PLAY
                </button>
                <button
                  onClick={() => setLegalModalType('brand')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#08060D] border border-[#26213D] text-[#00F0FF] hover:text-white hover:border-[#00F0FF] transition-colors"
                >
                  BRAND ASSETS
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-mono-code text-[#8E8A9F] hover:text-[#00F0FF] transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>STAFF PORTAL &amp; CMS ACCESS</span>
              </button>

              <button
                onClick={() => setLegalModalType('brand')}
                className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#8E8A9F] hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>BRAND KIT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#8E8A9F]">
          <div className="text-center sm:text-left">
            © 2026 GRENITE ESPORTS (GE ESPORTS). ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`mailto:${BRAND.email}`}
              className="text-[#00F0FF] hover:underline transition-colors font-medium"
            >
              {BRAND.email}
            </a>

            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00F0FF] transition-colors"
            >
              {BRAND.instagramHandle}
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#075BFF] hover:to-[#8B5CF6] hover:text-white text-white border border-white/10 transition-colors shadow-md"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-orbitron font-bold">TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
