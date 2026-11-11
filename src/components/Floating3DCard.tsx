import React, { useRef } from 'react';

export interface Floating3DCardProps {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
  accentColor?: 'blue' | 'violet' | 'cyan';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  interactive?: boolean;
  priority?: boolean;
}

export const Floating3DCard: React.FC<Floating3DCardProps> = ({
  image,
  title,
  subtitle,
  badge,
  meta,
  accentColor = 'blue',
  className = '',
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const getAccentBorder = () => {
    switch (accentColor) {
      case 'violet':
        return 'border-[#8B5CF6]/40 hover:border-[#8B5CF6] group-hover:shadow-[0_0_35px_rgba(139,92,246,0.35)]';
      case 'cyan':
        return 'border-[#00F0FF]/40 hover:border-[#00F0FF] group-hover:shadow-[0_0_35px_rgba(0,240,255,0.35)]';
      case 'blue':
      default:
        return 'border-[#075BFF]/40 hover:border-[#075BFF] group-hover:shadow-[0_0_35px_rgba(7,91,255,0.35)]';
    }
  };

  const getBadgeClass = () => {
    switch (accentColor) {
      case 'violet':
        return 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#C4B5FD]';
      case 'cyan':
        return 'bg-[#00F0FF]/20 border-[#00F0FF]/50 text-[#00F0FF]';
      case 'blue':
      default:
        return 'bg-[#075BFF]/20 border-[#075BFF]/50 text-[#60A5FA]';
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={style}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer select-none border transition-all duration-300 bg-[#120F1F] shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:scale-[1.02] ${getAccentBorder()} ${className}`}
    >
      {/* Background Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110 group-hover:brightness-105 group-hover:scale-108 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-[#08060D]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#08060D]/80" />

        {/* Cyberpunk Chamfer Accent Corner */}
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#00F0FF]/60" />
        </div>

        {/* Badges and tags */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
          {badge && (
            <span
              className={`px-2.5 py-1 rounded-md font-orbitron text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getBadgeClass()}`}
            >
              {badge}
            </span>
          )}

          {meta && (
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 font-mono-code text-[10px] font-semibold text-[#DDE1E8]">
              {meta}
            </span>
          )}
        </div>

        {/* Bottom Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-1.5 transform-style-3d">
          <div className="font-orbitron text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors drop-shadow-md">
            {title}
          </div>

          {subtitle && (
            <p className="font-rajdhani text-sm text-[#DDE1E8]/80 font-medium line-clamp-2 leading-snug">
              {subtitle}
            </p>
          )}

          {/* Interactive neon scan bar */}
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono-code text-[#8E8A9F]">
            <span className="flex items-center gap-1.5 text-[#00F0FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
              <span>GE // TELEMETRY</span>
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center gap-1">
              <span>EXPLORE</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

