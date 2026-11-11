import React, { useState } from 'react';
import { Shield, Sparkles, ChevronRight, UserCheck } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import type { Player } from '../types';

export const RosterSection: React.FC = () => {
  const { roster, setSelectedPlayer } = useEsports();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'IGL',
    'PRIMARY RUSHERS',
    'SECONDARY RUSHERS',
    'SNIPER',
  ];

  const getPlayerCategory = (player: Player) => {
    if (player.category) return player.category;
    if (player.role === 'IGL') return 'IGL';
    if (player.role === 'Primary Rusher') return 'PRIMARY RUSHERS';
    if (player.role === 'Secondary Rusher') return 'SECONDARY RUSHERS';
    if (player.role === 'Sniper') return 'SNIPER';
    if (player.role === 'Rusher') return 'PRIMARY RUSHERS';
    return 'ALL';
  };

  const filteredRoster = roster.filter((player) => {
    if (selectedCategory === 'ALL') return true;
    const cat = getPlayerCategory(player);
    return cat === selectedCategory;
  });

  const getRoleAccent = (player: Player) => {
    const cat = getPlayerCategory(player);
    switch (cat) {
      case 'IGL':
        return {
          border: 'border-[#00F0FF]/50 hover:border-[#00F0FF]',
          glow: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.35)]',
          badge: 'bg-[#00F0FF]/20 border-[#00F0FF]/60 text-[#00F0FF]',
          accent: '#00F0FF',
        };
      case 'PRIMARY RUSHERS':
        return {
          border: 'border-[#075BFF]/50 hover:border-[#075BFF]',
          glow: 'hover:shadow-[0_0_35px_rgba(7,91,255,0.35)]',
          badge: 'bg-[#075BFF]/20 border-[#075BFF]/60 text-[#60A5FA]',
          accent: '#075BFF',
        };
      case 'SECONDARY RUSHERS':
        return {
          border: 'border-[#8B5CF6]/50 hover:border-[#8B5CF6]',
          glow: 'hover:shadow-[0_0_35px_rgba(139,92,246,0.35)]',
          badge: 'bg-[#8B5CF6]/20 border-[#8B5CF6]/60 text-[#C4B5FD]',
          accent: '#8B5CF6',
        };
      case 'SNIPER':
      default:
        return {
          border: 'border-[#F59E0B]/50 hover:border-[#F59E0B]',
          glow: 'hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]',
          badge: 'bg-[#F59E0B]/20 border-[#F59E0B]/60 text-[#FBBF24]',
          accent: '#F59E0B',
        };
    }
  };

  // 3D Card Item with smooth hardware-accelerated hover
  const PlayerTiltCard: React.FC<{ player: Player }> = ({ player }) => {
    const accentTheme = getRoleAccent(player);

    return (
      <div
        onClick={() => setSelectedPlayer(player)}
        className={`group relative rounded-2xl bg-[#120F1F] border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:-translate-y-2 hover:scale-[1.02] ${accentTheme.border} ${accentTheme.glow}`}
      >
        {/* Subtle Specular Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <span
            className={`px-3 py-1 rounded-md font-orbitron text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${accentTheme.badge}`}
          >
            {player.role}
          </span>

          <span
            className="px-2.5 py-1 rounded-md font-orbitron text-xs font-black text-black shadow-md"
            style={{ backgroundColor: accentTheme.accent }}
          >
            #{player.jerseyNumber}
          </span>
        </div>

        {/* Player Image with Ambient Lighting */}
        <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#08060D]">
          <img
            src={player.image}
            alt={player.ign}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-90 group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F1F] via-[#120F1F]/40 to-transparent" />

          {/* Sci-Fi Corner Bracket */}
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2"
              style={{ borderColor: accentTheme.accent }}
            />
          </div>

          {/* Quick Stats Overlay strip */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between font-mono-code text-xs text-white/90 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
            <div>
              <span className="text-[10px] text-[#8E8A9F] block">K/D</span>
              <span className="font-bold font-orbitron text-white">{player.kdr || '4.0'}</span>
            </div>
            <div className="border-l border-white/10 pl-3">
              <span className="text-[10px] text-[#8E8A9F] block">CLUTCH</span>
              <span className="font-bold font-orbitron text-[#00F0FF]">{player.clutchRate || '80%'}</span>
            </div>
            <div className="border-l border-white/10 pl-3">
              <span className="text-[10px] text-[#8E8A9F] block">HEADSHOT</span>
              <span className="font-bold font-orbitron" style={{ color: accentTheme.accent }}>
                {player.headshotRate || '70%'}
              </span>
            </div>
          </div>
        </div>

        {/* Player Info & Weaponry */}
        <div className="p-6 pt-3 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors">
                {player.ign}
              </h3>
              <span className="font-mono-code text-[11px] text-[#8E8A9F]">
                {player.device.split(' ')[0]}
              </span>
            </div>

            <p className="font-rajdhani text-sm text-[#8E8A9F] font-semibold truncate mb-2">
              {player.name}
            </p>

            <p className="font-rajdhani text-xs sm:text-sm text-[#DDE1E8]/75 line-clamp-2 font-light leading-relaxed mb-3">
              {player.bio}
            </p>

            {/* Signature Weapons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {player.signatureWeapons.map((weapon, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-black/70 border border-[#26213D] text-[10px] font-mono-code text-[#DDE1E8]"
                >
                  {weapon}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Dossier Trigger */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span
              className="text-xs font-orbitron font-bold flex items-center gap-1.5 transition-transform group-hover:translate-x-1"
              style={{ color: accentTheme.accent }}
            >
              <span>INSPECT DOSSIER</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>

            <span className="font-mono-code text-[10px] text-[#8E8A9F]">
              CLICK TO EXPAND
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="roster" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#075BFF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#26213D] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>OFFICIAL COMPETITIVE ROSTER</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              PRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">ATHLETES</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              Led by Captain Krishna. Armed with world-class entry fraggers AQUA, Karan &amp; Tawban; tactical secondary rushers Soumik, Sufiyan &amp; Sanatani; and sharpshooter Aditya.
            </p>
          </div>

          {/* Roster Live Status Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#120F1F] border border-[#26213D] flex items-center gap-2.5 font-mono-code text-xs text-[#DDE1E8]">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>8 SIGNED PRO ATHLETES</span>
            </div>
          </div>
        </div>

        {/* Role Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <span className="text-xs font-orbitron font-bold text-[#8E8A9F] uppercase mr-2 shrink-0">
            DIVISION ROLES:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white border-white/20 shadow-[0_0_20px_rgba(7,91,255,0.4)]'
                  : 'bg-[#120F1F] text-[#8E8A9F] border-[#26213D] hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D Tilt Player Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredRoster.map((player) => (
            <PlayerTiltCard key={player.id} player={player} />
          ))}
        </div>

        {/* Roster Callout Box */}
        <div className="mt-14 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#120F1F] via-[#1A1630] to-[#120F1F] border border-[#26213D] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="sub-header-pill text-[10px]">
              <Sparkles className="w-3 h-3 text-[#00F0FF]" />
              <span>TALENT SCOUTING IN PROGRESS</span>
            </div>
            <h4 className="font-orbitron text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              PROVE YOUR METTLE UNDER THE GE BANNER
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              We scout tier-1 Free Fire talent across India. Submit your match UID, preferred role, and gameplay highlight reel.
            </p>
          </div>

          <a
            href="#join"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white font-orbitron font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all shrink-0 shadow-[0_0_25px_rgba(7,91,255,0.4)]"
          >
            <UserCheck className="w-4 h-4 text-[#00F0FF]" />
            <span>APPLY FOR TRYOUTS</span>
          </a>
        </div>
      </div>
    </section>
  );
};
