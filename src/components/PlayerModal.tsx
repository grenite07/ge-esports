import React from 'react';
import { X, Shield, Crosshair, Cpu, Award, Zap, ExternalLink } from 'lucide-react';
import type { Player } from '../types';
import { InstagramIcon, YouTubeIcon } from './SocialIcons';

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#120F1F] border border-[#26213D] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26213D] bg-[#08060D]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#00F0FF] rounded-full animate-pulse" />
            <span className="font-orbitron text-xs text-[#00F0FF] tracking-widest uppercase">
              ATHLETE DOSSIER // FREE FIRE INDIA
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8A9F] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Top profile card header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden bg-[#08060D] border-2 border-[#8B5CF6]/50 shrink-0 shadow-lg">
              <img
                src={player.image}
                alt={player.ign}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-black/85 font-orbitron text-[11px] font-bold text-[#00F0FF] border border-[#00F0FF]/40">
                #{player.jerseyNumber}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="sub-header-pill text-[10px]">{player.role}</span>
                {player.category && (
                  <span className="px-2.5 py-0.5 rounded bg-[#075BFF]/20 border border-[#075BFF]/40 text-[#60A5FA] font-orbitron text-[9px] font-bold">
                    {player.category}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono-code text-[10px]">
                  ACTIVE LINEUP
                </span>
              </div>

              <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {player.ign}
              </h2>
              <p className="font-rajdhani text-sm sm:text-base text-[#8E8A9F] font-bold">
                {player.name}
              </p>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#08060D] border border-[#26213D]">
              <span className="font-mono-code text-[10px] text-[#8E8A9F] block mb-1">
                K/D RATIO
              </span>
              <span className="font-orbitron text-2xl font-black text-white">
                {player.kdr || '4.10'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08060D] border border-[#26213D]">
              <span className="font-mono-code text-[10px] text-[#8E8A9F] block mb-1">
                CLUTCH WIN RATE
              </span>
              <span className="font-orbitron text-2xl font-black text-[#00F0FF]">
                {player.clutchRate || '82%'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08060D] border border-[#26213D]">
              <span className="font-mono-code text-[10px] text-[#8E8A9F] block mb-1">
                HEADSHOT RATE
              </span>
              <span className="font-orbitron text-2xl font-black text-[#8B5CF6]">
                {player.headshotRate || '72%'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08060D] border border-[#26213D]">
              <span className="font-mono-code text-[10px] text-[#8E8A9F] block mb-1">
                TACTICAL ROLE
              </span>
              <span className="font-orbitron text-sm font-bold text-white truncate block">
                {player.role}
              </span>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h3 className="font-orbitron text-xs tracking-wider text-white uppercase flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>COMPETITIVE PROFILE</span>
            </h3>
            <p className="text-sm text-[#DDE1E8]/85 leading-relaxed font-rajdhani font-medium">
              {player.bio}
            </p>
          </div>

          {/* Gameplay highlight & signature weapons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#08060D] border border-[#26213D] space-y-2">
              <h4 className="font-orbitron text-xs text-[#00F0FF] flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5" />
                <span>SIGNATURE LOADOUT</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {player.signatureWeapons.map((weapon, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#120F1F] border border-[#26213D] text-xs font-mono-code text-white"
                  >
                    {weapon}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#08060D] border border-[#26213D] space-y-2">
              <h4 className="font-orbitron text-xs text-[#8B5CF6] flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>HARDWARE &amp; MECHANICS</span>
              </h4>
              <p className="text-xs text-white font-orbitron pt-1 font-bold">
                {player.device}
              </p>
              <div className="text-xs text-[#8E8A9F] font-rajdhani pt-1">
                {player.gameplayHighlight}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {player.achievements && player.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-orbitron text-xs tracking-wider text-white uppercase flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>VERIFIED TOURNAMENT RECORD</span>
              </h3>
              <ul className="space-y-2 text-xs font-rajdhani font-medium text-[#DDE1E8]">
                {player.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#08060D] p-2.5 rounded-lg border border-white/5">
                    <Zap className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Profiles */}
          <div className="pt-4 border-t border-[#26213D] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {player.socials?.instagram && (
                <a
                  href={player.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#E1306C] hover:to-[#FD1D1D] text-xs font-orbitron text-white border border-white/10 transition-all shadow-md"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-[#8E8A9F]" />
                </a>
              )}
              {player.socials?.youtube && (
                <a
                  href={player.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-600 text-xs font-orbitron text-white border border-white/10 transition-all shadow-md"
                >
                  <YouTubeIcon className="w-3.5 h-3.5 text-red-400" />
                  <span>YouTube</span>
                  <ExternalLink className="w-3 h-3 text-[#8E8A9F]" />
                </a>
              )}
            </div>

            <div className="font-mono-code text-[11px] text-[#8E8A9F]">
              ATHLETE ID: {player.id.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
