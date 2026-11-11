import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Flame, Users, Sparkles, Trophy, Crosshair } from 'lucide-react';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!heroRef.current) return;
          const rect = heroRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setMousePos({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating cards arrangement at varying 3D depths & angles
  const floatingCards = [
    {
      id: 'fc-1',
      title: 'CHAMPIONSHIP STAGE',
      tag: 'FFIC TIER-1',
      image: '/images/arena.jpg',
      position: 'top-[8%] left-[2%] sm:left-[5%] lg:left-[8%]',
      baseZ: 60,
      baseRotate: -8,
      baseRotateX: 12,
      parallaxFactor: 35,
      glow: 'border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.25)]',
      accent: '#8B5CF6',
    },
    {
      id: 'fc-2',
      title: 'PRO ARMOR 2026',
      tag: 'FLAGSHIP APPAREL',
      image: '/images/jersey.jpg',
      position: 'top-[10%] right-[2%] sm:right-[5%] lg:right-[7%]',
      baseZ: -30,
      baseRotate: 9,
      baseRotateX: -10,
      parallaxFactor: -28,
      glow: 'border-[#075BFF]/50 shadow-[0_0_30px_rgba(7,91,255,0.25)]',
      accent: '#075BFF',
    },
    {
      id: 'fc-3',
      title: 'TACTICAL ROSTER',
      tag: '8 ATHLETES',
      image: '/images/hero.jpg',
      position: 'bottom-[12%] left-[3%] sm:left-[6%] lg:left-[10%]',
      baseZ: 80,
      baseRotate: 6,
      baseRotateX: 14,
      parallaxFactor: -40,
      glow: 'border-[#00F0FF]/50 shadow-[0_0_35px_rgba(0,240,255,0.25)]',
      accent: '#00F0FF',
    },
    {
      id: 'fc-4',
      title: 'CLUTCH MASTER',
      tag: 'SNIPER // ADITYA',
      image: '/images/player1.jpg',
      position: 'bottom-[14%] right-[3%] sm:right-[6%] lg:right-[9%]',
      baseZ: 40,
      baseRotate: -7,
      baseRotateX: -12,
      parallaxFactor: 32,
      glow: 'border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.25)]',
      accent: '#8B5CF6',
    },
  ];

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center pt-28 pb-20 overflow-hidden perspective-1200 bg-[#08060D]"
    >
      {/* Background Radial Light Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-[#075BFF]/15 via-[#8B5CF6]/15 to-[#00F0FF]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating 3D Gaming Artwork Cards (Behind & Around Content) */}
      <div className="absolute inset-0 z-0 pointer-events-none transform-style-3d">
        {floatingCards.map((card) => {
          const offsetX = mousePos.x * card.parallaxFactor;
          const offsetY = mousePos.y * card.parallaxFactor;
          const rotateY = card.baseRotate + mousePos.x * 16;
          const rotateX = card.baseRotateX - mousePos.y * 16;

          return (
            <div
              key={card.id}
              className={`absolute hidden md:block w-48 lg:w-56 aspect-[3/4] rounded-2xl overflow-hidden border backdrop-blur-md transition-transform duration-300 ease-out ${card.position} ${card.glow}`}
              style={{
                transform: `translate3d(${offsetX}px, ${offsetY}px, ${card.baseZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover filter brightness-85 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-[#08060D]/30 to-transparent" />
              
              {/* Corner badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 font-orbitron text-[9px] font-bold text-white uppercase tracking-wider">
                {card.tag}
              </div>

              {/* Title & neon line */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-orbitron text-xs font-black text-white uppercase tracking-tight">
                  {card.title}
                </div>
                <div
                  className="h-0.5 w-10 mt-1 rounded-full"
                  style={{ backgroundColor: card.accent }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Lateral Sci-Fi Telemetry Stamps */}
      <div className="hidden 2xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-5 text-[#8E8A9F] font-mono-code text-[11px] tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <span>GRENITE ESPORTS // EST. 2024</span>
        </span>
        <span className="w-16 h-px bg-[#26213D]" />
        <span className="text-[#00F0FF] font-orbitron font-bold">UNLEASH THE STORM</span>
      </div>

      <div className="hidden 2xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-5 text-[#8E8A9F] font-mono-code text-[11px] tracking-[0.3em] uppercase [writing-mode:vertical-lr]">
        <span>FREE FIRE INDIA DIVISION</span>
        <span className="w-16 h-px bg-[#26213D]" />
        <span className="text-white font-orbitron">TIER-1 PRO CIRCUIT</span>
      </div>

      {/* Main Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Prominent Official GE Logo Display with 3D Holographic Crest */}
        <div className="relative mb-6 group cursor-pointer">
          <div className="absolute -inset-3 bg-gradient-to-r from-[#075BFF] via-[#8B5CF6] to-[#00F0FF] rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#120F1F] border-2 border-[#8B5CF6]/60 p-2 shadow-[0_0_40px_rgba(139,92,246,0.4)] flex items-center justify-center transform-style-3d group-hover:rotate-6 transition-transform duration-500">
            <img
              src="/Logo GE.jpeg"
              alt="GE ESPORTS Official Crest"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(7,91,255,0.8)]"
            />
          </div>
        </div>

        {/* Live Operational Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="sub-header-pill">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <span>OFFICIAL FREE FIRE INDIA PRO CIRCUIT</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#120F1F]/80 backdrop-blur-md font-mono-code text-[11px] text-[#DDE1E8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>ROSTER VERIFIED</span>
          </div>
        </div>

        {/* Main Headline: "UNLEASH THE STORM." */}
        <div className="space-y-3 mb-6">
          <h1 className="font-orbitron text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter leading-[0.92] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            UNLEASH <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6] filter drop-shadow-[0_0_40px_rgba(7,91,255,0.6)]">
              THE STORM.
            </span>
          </h1>

          {/* Subtitle: "Built to Compete. Born to Dominate." */}
          <p className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#DDE1E8] tracking-widest uppercase flex items-center justify-center gap-3 pt-2">
            <span className="text-[#00F0FF]">Built to Compete.</span>
            <span className="text-[#8B5CF6]">Born to Dominate.</span>
            <Flame className="w-5 h-5 sm:w-7 sm:h-7 text-[#00F0FF] inline-block animate-pulse" />
          </p>
        </div>

        {/* Supporting Narrative */}
        <p className="text-base sm:text-lg lg:text-xl text-[#8E8A9F] max-w-2xl font-light font-rajdhani leading-relaxed mb-10">
          The next evolution of Indian competitive esports. Led by tactical mastery,
          unstoppable frontline rushers, and national championship ambitions.
        </p>

        {/* Required Primary CTAs: "Explore Team" & "Join Our Community" */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#roster"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-orbitron font-bold tracking-widest uppercase transition-all duration-300 rounded-xl bg-gradient-to-r from-[#075BFF] via-[#1a6cff] to-[#8B5CF6] hover:from-[#1a6cff] hover:to-[#00F0FF] text-white shadow-[0_0_35px_rgba(7,91,255,0.45)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] group border border-white/20"
          >
            <Users className="w-4 h-4 text-[#00F0FF]" />
            <span>EXPLORE TEAM</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#community"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-orbitron font-bold tracking-widest uppercase transition-all duration-300 rounded-xl bg-[#120F1F]/80 hover:bg-[#1a1630] text-white border border-[#8B5CF6]/40 hover:border-[#00F0FF] shadow-[0_0_20px_rgba(139,92,246,0.15)] group backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#8B5CF6] group-hover:text-[#00F0FF] transition-colors" />
            <span>JOIN OUR COMMUNITY</span>
          </a>
        </div>

        {/* Quick Telemetry Strip */}
        <div className="mt-12 pt-6 border-t border-[#26213D]/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono-code text-[#8E8A9F]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#00F0FF]" />
            <span>7 NATIONAL PODIUMS</span>
          </div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#8B5CF6]" />
            <span>8 PRO OPERATIVES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OFFICIAL DESK ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
