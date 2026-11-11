import React, { useState } from 'react';
import { Trophy, Calendar, Clock, Swords, CheckCircle2, ExternalLink, Search, Award, Sparkles, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEsports } from '../context/EsportsContext';

export const TournamentsSection: React.FC = () => {
  const { matches } = useEsports();
  const [activeTab, setActiveTab] = useState<'ACHIEVEMENTS' | 'UPCOMING' | 'RESULTS'>('ACHIEVEMENTS');
  const [searchQuery, setSearchQuery] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#075BFF', '#8B5CF6', '#F59E0B'],
    });
  };

  const achievementsList = [
    {
      id: 'ach-1',
      title: 'BATTLE ARENA INDIA SEASON 4',
      placement: '1ST PLACE // CHAMPIONS 🏆',
      stage: 'Grand Finals',
      date: 'OCTOBER 2026',
      kills: 52,
      points: 118,
      accent: '#F59E0B',
      description: 'National championship victory against 12 tier-1 Indian rosters. Set record for most squad frags in a single finals weekend.',
      image: '/images/hero.jpg',
      badge: 'NATIONAL CHAMPION',
    },
    {
      id: 'ach-2',
      title: 'RED BULL NATIONAL SCRIMS MASTERS',
      placement: '2ND PLACE // RUNNERS-UP 🥈',
      stage: 'Super Weekend 2',
      date: 'OCTOBER 2026',
      kills: 41,
      points: 92,
      accent: '#8B5CF6',
      description: 'Super Weekend podium finish with 3 Booyahs and the highest defensive zone survival score in tournament history.',
      image: '/images/arena.jpg',
      badge: 'PODIUM FINISH',
    },
    {
      id: 'ach-3',
      title: 'WINTER STORM INVITATIONAL CUP',
      placement: '3RD PLACE // BRONZE MEDAL 🥉',
      stage: 'Finals Day 2',
      date: 'SEPTEMBER 2026',
      kills: 35,
      points: 78,
      accent: '#00F0FF',
      description: 'Decisive clutch performances by Aditya and AQUA to lock down third place in a fiercely contested all-India lobby.',
      image: '/images/player1.jpg',
      badge: 'TOP 3 NATIONWIDE',
    },
  ];

  const filteredMatches = matches.filter((match) => {
    if (activeTab === 'UPCOMING' && match.status !== 'UPCOMING') return false;
    if (activeTab === 'RESULTS' && match.status !== 'COMPLETED') return false;

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
    <section id="matches" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D]">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#8B5CF6]/10 via-[#075BFF]/10 to-transparent rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#26213D] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <Trophy className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>COMPETITIVE GLORY &amp; SCHEDULES</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              TOURNAMENTS &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">PODIUMS</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              Track GE Esports across national Free Fire championships, historic silverware triumphs, real-time match results, and upcoming lobby schedules.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-[#120F1F] border border-[#26213D] rounded-xl">
              {(
                [
                  { id: 'ACHIEVEMENTS', label: 'ACHIEVEMENTS & TROPHIES', icon: Award },
                  { id: 'UPCOMING', label: 'UPCOMING MATCHES', icon: Swords },
                  { id: 'RESULTS', label: 'MATCH RESULTS', icon: CheckCircle2 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-orbitron text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white shadow-[0_0_15px_rgba(7,91,255,0.4)]'
                        : 'text-[#8E8A9F] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB 1: ACHIEVEMENTS & CHAMPIONSHIP HIGHLIGHTS */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Trophy Celebration Trigger Bar */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#120F1F] border border-[#26213D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-orbitron text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    7 VERIFIED NATIONAL PODIUMS &amp; TROPHIES
                  </h4>
                  <p className="font-rajdhani text-xs sm:text-sm text-[#8E8A9F]">
                    Free Fire India Circuit • Battle Arena Champions • Scrims Masters
                  </p>
                </div>
              </div>

              <button
                onClick={triggerConfetti}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-black font-orbitron text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-115 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>CELEBRATE VICTORY</span>
              </button>
            </div>

            {/* Achievement Cards Grid with 3D Depth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {achievementsList.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#F59E0B] transition-all duration-300 overflow-hidden flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.25)] hover:-translate-y-1"
                >
                  {/* Card Visual Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#08060D]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120F1F] via-[#120F1F]/40 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded font-orbitron text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/75 border border-white/10 text-white">
                      {item.badge}
                    </div>

                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/75 border border-white/10 text-[#F59E0B]">
                      <Medal className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="font-mono-code text-[11px] text-[#8E8A9F] block mb-1">
                        {item.date} // {item.stage}
                      </span>
                      <h3 className="font-orbitron text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors">
                        {item.title}
                      </h3>
                      <div className="font-orbitron text-sm font-bold text-[#F59E0B] mt-1">
                        {item.placement}
                      </div>

                      <p className="font-rajdhani text-xs sm:text-sm text-[#DDE1E8]/75 leading-relaxed mt-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Stats strip */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-[#08060D] border border-[#26213D]">
                        <span className="font-mono-code text-[10px] text-[#8E8A9F] block">SQUAD KILLS</span>
                        <span className="font-orbitron text-base font-black text-white">{item.kills}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#08060D] border border-[#26213D]">
                        <span className="font-mono-code text-[10px] text-[#8E8A9F] block">TOTAL POINTS</span>
                        <span className="font-orbitron text-base font-black text-[#00F0FF]">{item.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2 & 3: UPCOMING & RESULTS LIST */}
        {activeTab !== 'ACHIEVEMENTS' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search Input */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-[#8E8A9F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by tournament or opponent..."
                  className="w-full bg-[#120F1F] border border-[#26213D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <span className="font-mono-code text-xs text-[#8E8A9F] hidden sm:block">
                ALL TIMINGS IN IST (UTC+5:30)
              </span>
            </div>

            {/* Matches Cards */}
            {filteredMatches.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#120F1F] border border-[#26213D]">
                <Trophy className="w-12 h-12 text-[#8E8A9F] mx-auto mb-3 opacity-40" />
                <h3 className="font-orbitron text-lg font-bold text-white uppercase mb-1">
                  No Tournament Records
                </h3>
                <p className="text-xs text-[#8E8A9F] font-rajdhani">
                  No matches match your current filter. Switch tabs to view past records or achievements.
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
                      className={`group relative p-5 sm:p-6 rounded-2xl bg-[#120F1F] border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isLive
                          ? 'border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] bg-[#161226]'
                          : 'border-[#26213D] hover:border-[#8B5CF6]/60 hover:bg-[#161226]'
                      }`}
                    >
                      {/* Left Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-semibold">
                            {match.game}
                          </span>

                          {isUpcoming ? (
                            <span className="font-orbitron text-[10px] px-2.5 py-0.5 rounded bg-[#075BFF]/20 border border-[#075BFF]/50 text-[#60A5FA] font-bold">
                              UPCOMING
                            </span>
                          ) : isLive ? (
                            <span className="font-orbitron text-[10px] px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-400 font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              LIVE BROADCAST
                            </span>
                          ) : (
                            <span className="font-orbitron text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              FINAL RESULT
                            </span>
                          )}
                        </div>

                        <h3 className="font-orbitron text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-[#00F0FF] transition-colors">
                          {match.tournament}
                        </h3>

                        <p className="font-mono-code text-xs text-[#8E8A9F]">
                          {match.stage}
                        </p>

                        {match.opponents && match.opponents.length > 0 && (
                          <div className="text-xs text-[#8E8A9F] font-rajdhani flex items-center gap-1.5 pt-1">
                            <span className="text-white font-semibold">Competitors:</span>
                            <span>{match.opponents.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Details */}
                      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                        {isUpcoming ? (
                          <div className="flex items-center gap-6">
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 font-mono-code text-xs text-[#8E8A9F]">
                                <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
                                <span>{match.dateIST}</span>
                              </span>
                              <span className="flex items-center gap-1.5 font-orbitron text-sm font-bold text-white">
                                <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                <span>{match.timeIST}</span>
                              </span>
                            </div>

                            {match.streamUrl && (
                              <a
                                href={match.streamUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#075BFF] hover:to-[#8B5CF6] hover:text-white text-xs font-orbitron font-bold text-[#DDE1E8] border border-white/10 transition-colors shadow-md"
                              >
                                <span>WATCH STREAM</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 sm:gap-6">
                            {match.placement && (
                              <div className="text-right">
                                <span className="font-mono-code text-[10px] text-[#8E8A9F] block">
                                  PLACEMENT
                                </span>
                                <span className="font-orbitron text-base sm:text-lg font-black text-[#F59E0B]">
                                  {match.placement}
                                </span>
                              </div>
                            )}

                            {match.kills !== undefined && (
                              <div className="text-right pl-4 border-l border-white/10">
                                <span className="font-mono-code text-[10px] text-[#8E8A9F] block">
                                  KILLS
                                </span>
                                <span className="font-orbitron text-base sm:text-lg font-black text-white">
                                  {match.kills}
                                </span>
                              </div>
                            )}

                            {match.totalPoints !== undefined && (
                              <div className="text-right pl-4 border-l border-white/10">
                                <span className="font-mono-code text-[10px] text-[#8E8A9F] block">
                                  POINTS
                                </span>
                                <span className="font-orbitron text-base sm:text-lg font-black text-[#00F0FF]">
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
        )}
      </div>
    </section>
  );
};
