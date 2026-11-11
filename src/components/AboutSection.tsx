import React from 'react';
import { Target, Compass, Zap, Users, Globe2, ShieldCheck, ChevronRight } from 'lucide-react';
import { BRAND } from '../data/initialData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#075BFF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-4 mb-16 max-w-3xl">
          <div className="sub-header-pill">
            <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>ORGANIZATIONAL IDENTITY &amp; CODE</span>
          </div>
          <h2 className="editorial-title text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
            MORE THAN A TEAM. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">
              A NATIONAL MOVEMENT.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
            GE ESPORTS (Grenite Esports) was founded with an uncompromising conviction: to provide Indian competitive athletes with elite infrastructure, tactical analytics, and championship-caliber mental conditioning.
          </p>
        </div>

        {/* Asymmetric 3D Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Story Feature (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl bg-[#120F1F] border border-[#26213D] relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#8B5CF6]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="font-orbitron text-xs text-[#00F0FF] tracking-widest uppercase">
                  CHAPTER 01 // FOUNDATIONAL GENESIS
                </span>
              </div>

              <h3 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                OUR STORY &amp; BATTLEFIELD CULTURE
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-[#DDE1E8]/85 font-rajdhani font-medium leading-relaxed">
                <p>
                  Emerging from India's surging competitive revolution, Grenite Esports unites raw mechanical mastery with systematic squad analytics. Starting with our premier <strong className="text-white font-bold">Free Fire India</strong> division, we are proving that disciplined shot-calling, high-tempo breaches, and relentless practice triumph on the championship stage.
                </p>
                <p>
                  Led by Captain Krishna, our operatives treat esports as a true athletic discipline. From daily scrim rehearsals and zone trajectory telemetry to mental resilience and split-second utility synchronization, we leave zero room for chance.
                </p>
              </div>
            </div>

            {/* Motto Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-orbitron text-xs text-[#8E8A9F] uppercase tracking-wider">
                MOTTO: <strong className="text-white">"{BRAND.tagline}"</strong>
              </span>
              <span className="font-mono-code text-xs text-[#00F0FF]">
                GE // PRO ATHLETICS
              </span>
            </div>
          </div>

          {/* Mission & Vision Stack (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 sm:p-8 rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#00F0FF] transition-all space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-[#00F0FF]">
                <Target className="w-5 h-5" />
                <span className="font-orbitron text-xs font-bold tracking-wider uppercase">
                  OUR MISSION
                </span>
              </div>
              <h4 className="font-orbitron text-xl font-bold text-white uppercase">
                ELEVATING GRASSROOTS INDIAN TALENT
              </h4>
              <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
                To identify raw gaming prodigies across the subcontinent and empower them with professional boot camp environments, tier-1 sponsorships, and international competitive stages.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#8B5CF6] transition-all space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-[#8B5CF6]">
                <Zap className="w-5 h-5" />
                <span className="font-orbitron text-xs font-bold tracking-wider uppercase">
                  OUR VISION
                </span>
              </div>
              <h4 className="font-orbitron text-xl font-bold text-white uppercase">
                A MULTI-TITLE ESPORTS TITAN
              </h4>
              <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
                Establishing Grenite Esports as a premier global gaming titan and lifestyle phenomenon, recognized for national trophies, cultural resonance, and visionary community engagement.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars of GE Athletics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-7 rounded-2xl bg-[#120F1F] border border-[#26213D] space-y-3 hover:border-[#075BFF] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#075BFF]/15 border border-[#075BFF]/30 flex items-center justify-center text-[#075BFF]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-white uppercase">
              TACTICAL RIGOR
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
              Every drop zone, weapon meta change, and zone rotation is backed by mathematical telemetry and dedicated scrim replay reviews.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#120F1F] border border-[#26213D] space-y-3 hover:border-[#8B5CF6] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-white uppercase">
              ATHLETE WELLBEING
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
              Holistic player health, physical training, reaction-speed drills, fair compensation, and sustainable esports career pathways.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#120F1F] border border-[#26213D] space-y-3 hover:border-[#00F0FF] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
              <Globe2 className="w-6 h-6" />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-white uppercase">
              FUTURE HORIZONS
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium leading-relaxed">
              Active roadmaps for multi-title expansion across PC and mobile tournaments while cultivating a high-end streetwear lifestyle line.
            </p>
          </div>
        </div>

        {/* Commercial Partnership Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="font-orbitron text-xs text-[#00F0FF] uppercase tracking-wider">
              COMMERCIAL INQUIRIES &amp; BRAND ALLIANCES
            </div>
            <h4 className="font-orbitron text-2xl font-black text-white uppercase">
              PARTNER WITH GRENITE ESPORTS
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              Align your brand with India's fastest-growing competitive esports movement. Inquire about jersey branding, tournament activations, and digital sponsorships.
            </p>
          </div>

          <a
            href="mailto:grenite07@gmail.com"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white font-orbitron text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shrink-0 shadow-lg"
          >
            <span>PARTNERSHIP DESK</span>
            <ChevronRight className="w-4 h-4 text-[#00F0FF]" />
          </a>
        </div>
      </div>
    </section>
  );
};
