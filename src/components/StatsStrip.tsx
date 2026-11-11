import React from 'react';
import { Users, Trophy, Target, Globe, Edit3, Shield } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';

export const StatsStrip: React.FC = () => {
  const { stats, setIsAdminOpen } = useEsports();

  const getIcon = (id: string) => {
    switch (id) {
      case 'roster-count':
        return <Users className="w-5 h-5 text-[#00F0FF]" />;
      case 'tournaments':
        return <Target className="w-5 h-5 text-[#075BFF]" />;
      case 'achievements':
        return <Trophy className="w-5 h-5 text-[#F59E0B]" />;
      case 'reach':
      default:
        return <Globe className="w-5 h-5 text-[#8B5CF6]" />;
    }
  };

  const getBorderColor = (id: string) => {
    switch (id) {
      case 'roster-count':
        return 'hover:border-[#00F0FF] hover:shadow-[0_0_25px_rgba(0,240,255,0.25)]';
      case 'tournaments':
        return 'hover:border-[#075BFF] hover:shadow-[0_0_25px_rgba(7,91,255,0.25)]';
      case 'achievements':
        return 'hover:border-[#F59E0B] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]';
      case 'reach':
      default:
        return 'hover:border-[#8B5CF6] hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]';
    }
  };

  return (
    <section className="relative z-20 border-y border-[#26213D] bg-[#0A0712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-white/5 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="font-orbitron text-xs tracking-widest text-[#8E8A9F] uppercase">
              ORGANIZATION METRICS &amp; ACTIVE BENCHMARKS
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-code text-[#8E8A9F]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white">
              <Shield className="w-3 h-3 text-[#00F0FF]" />
              <span>OFFICIAL TELEMETRY</span>
            </span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#00F0FF] hover:underline"
              title="Edit metrics in CMS"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>CONFIGURE</span>
            </button>
          </div>
        </div>

        {/* 4-column metric grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((metric, index) => (
            <div
              key={metric.id}
              className={`relative group p-5 sm:p-6 rounded-2xl bg-[#120F1F] border border-[#26213D] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${getBorderColor(
                metric.id
              )}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-code text-[11px] text-[#8E8A9F] tracking-wider uppercase">
                  0{index + 1} // {metric.label}
                </span>
                <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  {getIcon(metric.id)}
                </div>
              </div>

              <div className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1 group-hover:text-[#00F0FF] transition-colors">
                {metric.value}
              </div>

              <div className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani font-medium">
                {metric.description}
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-code text-[#8E8A9F]">
                <span>GE // DIVISION</span>
                <span className="text-[#00F0FF]">LIVE SYNCED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
