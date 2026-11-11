import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight, Lock, Mail } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setIsAdminOpen, openContactModal } = useEsports();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: '3D EXPERIENCE', href: '#3d-experience' },
    { label: 'ROSTER', href: '#roster' },
    { label: 'TOURNAMENTS', href: '#matches' },
    { label: 'MEDIA', href: '#media' },
    { label: 'COLLECTION', href: '#collection' },
    { label: 'COMMUNITY', href: '#community' },
    { label: 'ABOUT', href: '#about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] border-b border-[#26213D]'
            : 'bg-transparent py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <a
              href="#home"
              className="flex items-center gap-3.5 group focus:outline-none"
              aria-label="GE Esports Home"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#8B5CF6]/40 group-hover:border-[#00F0FF] transition-all p-1 bg-[#120F1F] shadow-[0_0_15px_rgba(7,91,255,0.3)]">
                <img
                  src="/Logo GE.jpeg"
                  alt="GE ESPORTS Official Logo"
                  className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-orbitron font-black tracking-wider text-white text-base sm:text-lg leading-tight group-hover:text-[#00F0FF] transition-colors">
                    GE ESPORTS
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                </div>
                <span className="font-mono-code text-[10px] tracking-widest text-[#8E8A9F] uppercase">
                  Free Fire India Division
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 text-xs font-orbitron font-bold tracking-wider">
              {navLinks.map((link) => {
                const sectionId = link.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`relative py-1 transition-all duration-200 uppercase ${
                      isActive
                        ? 'text-[#00F0FF] font-black'
                        : 'text-[#8E8A9F] hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] shadow-[0_0_10px_#00F0FF]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => openContactModal('General Support & Queries', 'Quick contact from header')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono-code text-[#8E8A9F] hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-[#26213D] transition-colors"
                title={`Official Email Desk: ${BRAND.email}`}
              >
                <Mail className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="hidden 2xl:inline">{BRAND.email}</span>
                <span className="2xl:hidden">EMAIL DESK</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-2 text-[#8E8A9F] hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-[#26213D]"
                title="Staff Portal / CMS"
                aria-label="Staff CMS"
              >
                <Lock className="w-4 h-4 text-[#8B5CF6]" />
              </button>

              <a
                href="#join"
                className="relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden text-xs font-orbitron font-bold tracking-widest uppercase transition-all duration-300 rounded-xl group bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] hover:brightness-110 text-white shadow-[0_0_20px_rgba(7,91,255,0.4)]"
              >
                <span className="flex items-center gap-1.5">
                  <span>JOIN GE</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => openContactModal()}
                className="p-2 text-[#8E8A9F] hover:text-white"
                aria-label="Email Contact Desk"
              >
                <Mail className="w-4 h-4 text-[#00F0FF]" />
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-2 text-[#8E8A9F] hover:text-white"
                aria-label="Staff CMS"
              >
                <Lock className="w-4 h-4 text-[#8B5CF6]" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:text-[#00F0FF] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden glass-nav border-t border-[#26213D] px-4 pt-4 pb-6 mt-3 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="font-mono-code text-[11px] text-[#8E8A9F]">
                GRENITE ESPORTS // {BRAND.email}
              </span>
              <span className="sub-header-pill text-[10px]">TIER-1 CIRCUIT</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-orbitron font-bold tracking-wider text-[#DDE1E8] hover:text-white hover:bg-white/5 uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openContactModal();
                }}
                className="flex items-center justify-center gap-2 py-3 text-xs font-orbitron font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10"
              >
                <Mail className="w-4 h-4 text-[#00F0FF]" />
                <span>EMAIL US</span>
              </button>

              <a
                href="#join"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 text-xs font-orbitron font-bold tracking-wider uppercase bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white rounded-xl shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span>TRYOUTS</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
