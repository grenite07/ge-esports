import React, { useState } from 'react';
import { Trophy, Calendar, Clock, Swords, CheckCircle2, AlertCircle, ExternalLink, Search } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';

export const MatchCenter: React.FC = () => {
  const { matches } = useEsports();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'RESULTS' | 'ALL'>('UPCOMING');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((match) => {
    // Tab filter
    if (activeTab === 'UPCOMING' && match.status !== 'UPCOMING') return false;
    if (activeTab === 'RESULTS' && match.status !== 'COMPLETED') return false;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        match.tournament.toLowerCase().includes(q) ||
        match.stage.toLowerCase().includes(q) ||
        (match.placement && match.placement.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <section id="matches" className="relative py-20 lg:py-28 bg-[#08080a] border-t border-[#23242c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#23242c] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <Swords className="w-3.5 h-3.5 text-[#075BFF]" />
              <span>COMPETITIVE OPERATIONS</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              MATCH <span className="text-[#075BFF]">CENTER</span>
            </h2>
            <p className="text-sm sm:text-base text-[#888888] max-w-xl font-light">
              Official Indian tournament schedules, live broadcast alerts, match results, placements, and cumulative kill records.
            </p>
          </div>

          {/* Controls: Search & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tournament..."
                className="w-full sm:w-48 bg-[#111114] border border-[#23242c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#075BFF]"
              />
            </div>

            {/* Functional Tabs: UPCOMING | RESULTS | ALL MATCHES */}
            <div className="flex items-center gap-1.5 p-1 bg-[#111114] border border-[#23242c] rounded-lg">
              {(['UPCOMING', 'RESULTS', 'ALL'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs font-mono-code rounded-md transition-all uppercase tracking-wider ${
                    activeTab === tab
                      ? 'bg-[#075BFF] text-white font-bold shadow-[0_0_12px_rgba(7,91,255,0.4)]'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {tab === 'UPCOMING'
                    ? 'Upcoming'
                    : tab === 'RESULTS'
                    ? 'Results'
                    : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Disclaimer / API Readiness Banner */}
        <div className="mb-8 p-3 rounded-lg bg-[#111114] border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono-code text-[#888888] gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#075BFF]" />
            <span>
              [CONFIGURED MATCH DATA — ALL TIMINGS STANDARDIZED IN IST (UTC+5:30)]
            </span>
          </div>
          <span className="text-[11px] text-[#666666]">
            API Engine: Ready for official tournament feed sync
          </span>
        </div>

        {/* Matches List Container */}
        {filteredMatches.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#111114] border border-[#23242c]">
            <Trophy className="w-12 h-12 text-[#888888] mx-auto mb-3 opacity-50" />
            <h3 className="font-display text-lg font-bold text-white uppercase mb-1">
              No Matches Found
            </h3>
            <p className="text-xs text-[#888888] font-light max-w-md mx-auto">
              There are currently no matches scheduled under this filter. Check back soon or switch tabs to view past results.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => {
              const isUpcoming = match.status === 'UPCOMING';
              const isLive = match.status === 'LIVE';

              return (
                <div
                  key={match.id}
                  className={`group relative p-5 sm:p-6 rounded-xl bg-[#111114] border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isLive
                      ? 'border-[#075BFF] shadow-[0_0_20px_rgba(7,91,255,0.2)] bg-[#111118]'
                      : 'border-[#23242c] hover:border-[#075BFF]/50 hover:bg-[#15151a]'
                  }`}
                >
                  {/* Left: Tournament & Game details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white font-semibold">
                        {match.game}
                      </span>

                      {isUpcoming ? (
                        <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-[#075BFF]/10 border border-[#075BFF]/30 text-[#075BFF] font-bold">
                          UPCOMING
                        </span>
                      ) : isLive ? (
                        <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          LIVE BROADCAST
                        </span>
                      ) : (
                        <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          FINAL RESULT
                        </span>
                      )}

                      {match.isDemo && (
                        <span className="text-[10px] font-mono-code text-[#666666]">
                          [DEMO]
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#075BFF] transition-colors">
                      {match.tournament}
                    </h3>

                    <p className="font-mono-code text-xs text-[#888888]">
                      {match.stage}
                    </p>

                    {match.opponents && match.opponents.length > 0 && (
                      <div className="text-xs text-[#666666] font-light flex items-center gap-1.5 pt-1">
                        <span className="text-[#888888]">Lobby / Competitors:</span>
                        <span>{match.opponents.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle / Right: Schedule or Score Results */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {isUpcoming ? (
                      <div className="flex items-center gap-6">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 font-mono-code text-xs text-[#888888]">
                            <Calendar className="w-3.5 h-3.5 text-[#075BFF]" />
                            <span>{match.dateIST}</span>
                          </span>
                          <span className="flex items-center gap-1.5 font-mono-code text-sm font-bold text-white">
                            <Clock className="w-3.5 h-3.5 text-[#075BFF]" />
                            <span>{match.timeIST}</span>
                          </span>
                        </div>

                        {match.streamUrl && (
                          <a
                            href={match.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/5 hover:bg-[#075BFF] hover:text-white text-xs font-mono-code text-[#DDE1E8] border border-white/10 transition-colors"
                          >
                            <span>STREAM</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 sm:gap-6">
                        {match.placement && (
                          <div className="text-right">
                            <span className="font-mono-code text-[10px] text-[#888888] block">
                              FINAL PLACEMENT
                            </span>
                            <span className="font-display text-base sm:text-lg font-black text-amber-400">
                              {match.placement}
                            </span>
                          </div>
                        )}

                        {match.kills !== undefined && (
                          <div className="text-right pl-4 border-l border-white/10">
                            <span className="font-mono-code text-[10px] text-[#888888] block">
                              SQUAD KILLS
                            </span>
                            <span className="font-display text-base sm:text-lg font-bold text-white">
                              {match.kills}
                            </span>
                          </div>
                        )}

                        {match.totalPoints !== undefined && (
                          <div className="text-right pl-4 border-l border-white/10">
                            <span className="font-mono-code text-[10px] text-[#888888] block">
                              POINTS
                            </span>
                            <span className="font-display text-base sm:text-lg font-bold text-[#075BFF]">
                              {match.totalPoints} PTS
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
