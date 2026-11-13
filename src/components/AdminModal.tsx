import React, { useState } from 'react';
import { X, Lock, Users, Swords, BarChart3, Inbox, Database, Plus, Trash2, Check, RefreshCw, Download, Upload, Shield } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { verifyAdminPin } from '../services/api';
import type { PlayerRole } from '../types';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    stats,
    updateStats,
    roster,
    addPlayer,
    updatePlayer,
    deletePlayer,
    matches,
    addMatch,
    deleteMatch,
    applications,
    updateApplicationStatus,
    resetAllData,
    exportDataJson,
    importDataJson,
    showToast,
  } = useEsports();


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'matches' | 'stats' | 'applications' | 'database'>('roster');

  // Form states for adding player
  const [newPlayer, setNewPlayer] = useState({
    ign: '',
    name: '',
    role: 'Rusher' as PlayerRole,
    jerseyNumber: '',
    bio: '',
    gameplayHighlight: '',
    signatureWeapons: 'M1887, MP40',
    device: 'Mobile Phone',
    image: '/images/player1.jpg',
    isSub: false,
    kdr: '3.50',
    clutchRate: '75%',
  });

  // Form states for adding match
  const [newMatch, setNewMatch] = useState({
    tournament: '',
    stage: 'Grand Finals',
    dateIST: new Date().toISOString().split('T')[0],
    timeIST: '19:00 IST',
    status: 'UPCOMING' as const,
    game: 'Free Fire Squad',
    placement: '',
    kills: 0,
    totalPoints: 0,
  });

  // Stats edit state
  const [editedStats, setEditedStats] = useState(stats);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (!cleanPin) {
      showToast('Please enter Staff Access PIN.', 'error');
      return;
    }
    setIsVerifyingPin(true);
    try {
      const isValid = await verifyAdminPin(cleanPin);
      if (isValid) {
        setIsAuthenticated(true);
        setPin('');
        showToast('Authenticated as Grenite Esports Staff', 'success');
      } else {
        showToast('Incorrect Staff Access PIN.', 'error');
      }
    } catch (error: any) {
      console.error('Staff PIN verification failed:', error);
      showToast(error?.message || 'Unable to verify Staff PIN. Please try again.', 'error');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.ign.trim() || !newPlayer.jerseyNumber.trim()) {
      showToast('IGN and Jersey Number are required', 'error');
      return;
    }

    addPlayer({
      ign: newPlayer.ign.toUpperCase(),
      name: newPlayer.name || 'Pro Athlete',
      role: newPlayer.role,
      jerseyNumber: newPlayer.jerseyNumber,
      image: newPlayer.image,
      isSub: newPlayer.isSub,
      bio: newPlayer.bio || 'Competitive Free Fire player for Grenite Esports.',
      achievements: ['Verified Regional Participant'],
      gameplayHighlight: newPlayer.gameplayHighlight || 'High-pressure tactical execution.',
      signatureWeapons: newPlayer.signatureWeapons.split(',').map((w) => w.trim()),
      device: newPlayer.device,
      kdr: newPlayer.kdr,
      clutchRate: newPlayer.clutchRate,
      socials: { instagram: 'https://www.instagram.com/ind_greniteesp/' },
      isDemo: false,
    });

    setNewPlayer({
      ign: '',
      name: '',
      role: 'Rusher',
      jerseyNumber: '',
      bio: '',
      gameplayHighlight: '',
      signatureWeapons: 'M1887, MP40',
      device: 'Mobile Phone',
      image: '/images/player1.jpg',
      isSub: false,
      kdr: '3.50',
      clutchRate: '75%',
    });
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.tournament.trim()) {
      showToast('Tournament name is required', 'error');
      return;
    }

    addMatch({
      tournament: newMatch.tournament,
      stage: newMatch.stage,
      dateIST: newMatch.dateIST,
      timeIST: newMatch.timeIST,
      status: newMatch.status,
      game: newMatch.game,
      placement: newMatch.placement || undefined,
      kills: Number(newMatch.kills) || undefined,
      totalPoints: Number(newMatch.totalPoints) || undefined,
      isDemo: false,
    });

    setNewMatch({
      tournament: '',
      stage: 'Grand Finals',
      dateIST: new Date().toISOString().split('T')[0],
      timeIST: '19:00 IST',
      status: 'UPCOMING',
      game: 'Free Fire Squad',
      placement: '',
      kills: 0,
      totalPoints: 0,
    });
  };

  const handleSaveStats = () => {
    updateStats(editedStats);
  };

  const handleExport = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ge_esports_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Configuration exported as JSON', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJson(content);
      }
    };
    reader.readAsText(file);
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-[#0c0c0e] border border-[#23242c] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23242c] bg-[#111114]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#075BFF]" />
            <div>
              <span className="font-display text-sm font-black text-white tracking-wider uppercase">
                GE ESPORTS STAFF CMS
              </span>
              <span className="font-mono-code text-[10px] text-[#888888] block">
                Content Management &amp; Scouting Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPin('');
                  showToast('Signed out of Staff CMS', 'info');
                }}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono-code text-[#888888] hover:text-white border border-white/10 transition-colors"
                title="Lock Staff CMS"
              >
                LOCK CMS
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5"
              aria-label="Close CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#075BFF]/10 text-[#075BFF] flex items-center justify-center border border-[#075BFF]/30">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-display text-2xl font-black text-white uppercase">
                STAFF ACCESS REQUIRED
              </h3>
              <p className="text-xs text-[#888888] font-light">
                Please enter the authorized staff passkey to modify rosters, competitive match records, and scouting data.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Staff PIN"
                className="w-full bg-black border border-[#23242c] rounded-lg px-4 py-3 text-center text-sm text-white placeholder:text-[#555555] focus:outline-none focus:border-[#075BFF] font-mono-code"
                autoFocus
              />
              <button
                disabled={isVerifyingPin}
                type="submit"
                className="w-full py-3 rounded-lg bg-[#075BFF] hover:bg-[#1a6cff] disabled:opacity-60 disabled:cursor-wait text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                {isVerifyingPin ? 'VERIFYING...' : 'UNLOCK STAFF PORTAL'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* CMS Nav Tabs */}
            <div className="flex items-center gap-1 px-6 py-2.5 bg-[#151518] border-b border-[#23242c] overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('roster')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono-code text-xs uppercase tracking-wider transition-colors ${
                  activeTab === 'roster'
                    ? 'bg-[#075BFF] text-white font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Roster ({roster.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono-code text-xs uppercase tracking-wider transition-colors ${
                  activeTab === 'matches'
                    ? 'bg-[#075BFF] text-white font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Matches ({matches.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono-code text-xs uppercase tracking-wider transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-[#075BFF] text-white font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Org Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono-code text-xs uppercase tracking-wider transition-colors ${
                  activeTab === 'applications'
                    ? 'bg-[#075BFF] text-white font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Scouting Inbox ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono-code text-xs uppercase tracking-wider transition-colors ${
                  activeTab === 'database'
                    ? 'bg-[#075BFF] text-white font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Sync / Backup</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* TAB 1: ROSTER MANAGER */}
              {activeTab === 'roster' && (
                <div className="space-y-6">
                  {/* Add Player Form */}
                  <form
                    onSubmit={handleCreatePlayer}
                    className="p-5 rounded-xl bg-[#111114] border border-[#23242c] space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="font-mono-code text-xs text-white font-bold uppercase flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-[#075BFF]" />
                        <span>REGISTER NEW PLAYER PROFILE</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-[#888888]">
                        Free Fire India Division
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          IGN *
                        </label>
                        <input
                          type="text"
                          value={newPlayer.ign}
                          onChange={(e) => setNewPlayer({ ...newPlayer, ign: e.target.value })}
                          placeholder="e.g. TITAN"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Role *
                        </label>
                        <select
                          value={newPlayer.role}
                          onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value as PlayerRole })}
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        >
                          <option value="IGL">IGL</option>
                          <option value="Rusher">Rusher</option>
                          <option value="Sniper">Sniper</option>
                          <option value="Support">Support</option>
                          <option value="Flex">Flex</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Jersey # *
                        </label>
                        <input
                          type="text"
                          value={newPlayer.jerseyNumber}
                          onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                          placeholder="e.g. 05"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Roster Status
                        </label>
                        <select
                          value={newPlayer.isSub ? 'sub' : 'active'}
                          onChange={(e) => setNewPlayer({ ...newPlayer, isSub: e.target.value === 'sub' })}
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        >
                          <option value="active">Active Starting 5</option>
                          <option value="sub">Substitute Reserve</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Player Bio
                        </label>
                        <input
                          type="text"
                          value={newPlayer.bio}
                          onChange={(e) => setNewPlayer({ ...newPlayer, bio: e.target.value })}
                          placeholder="Player background and playstyle summary..."
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Signature Weapons
                        </label>
                        <input
                          type="text"
                          value={newPlayer.signatureWeapons}
                          onChange={(e) => setNewPlayer({ ...newPlayer, signatureWeapons: e.target.value })}
                          placeholder="AWM, M1887"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded bg-[#075BFF] hover:bg-[#1a6cff] text-white text-xs font-mono-code font-bold uppercase transition-colors"
                      >
                        ADD ATHLETE TO ROSTER
                      </button>
                    </div>
                  </form>

                  {/* Active Roster List */}
                  <div className="space-y-2">
                    <span className="font-mono-code text-xs text-[#888888] uppercase block">
                      CURRENT REGISTERED ROSTER MEMBERS ({roster.length}):
                    </span>
                    <div className="space-y-2">
                      {roster.map((player) => (
                        <div
                          key={player.id}
                          className="p-3 rounded-lg bg-[#111114] border border-[#23242c] flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono-code text-xs font-bold text-[#075BFF] w-8">
                              #{player.jerseyNumber}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-white text-sm">
                                  {player.ign}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white/5 font-mono-code text-[10px] text-[#888888]">
                                  {player.role}
                                </span>
                                {player.isSub && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono-code text-[9px]">
                                    SUB
                                  </span>
                                )}
                              </div>
                              <span className="font-mono-code text-[11px] text-[#666666]">
                                {player.name} • {player.device}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updatePlayer(player.id, { isSub: !player.isSub })}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono-code text-[#DDE1E8] border border-white/10"
                            >
                              Toggle {player.isSub ? 'to Active' : 'to Sub'}
                            </button>
                            <button
                              onClick={() => deletePlayer(player.id)}
                              className="p-1.5 rounded text-red-400 hover:bg-red-500/10"
                              title="Delete player"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MATCH OPERATIONS */}
              {activeTab === 'matches' && (
                <div className="space-y-6">
                  {/* Add Match Form */}
                  <form
                    onSubmit={handleCreateMatch}
                    className="p-5 rounded-xl bg-[#111114] border border-[#23242c] space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="font-mono-code text-xs text-white font-bold uppercase flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-[#075BFF]" />
                        <span>REGISTER COMPETITIVE MATCH</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Tournament Name *
                        </label>
                        <input
                          type="text"
                          value={newMatch.tournament}
                          onChange={(e) => setNewMatch({ ...newMatch, tournament: e.target.value })}
                          placeholder="e.g. Free Fire India Cup 2026"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Stage / Matchday
                        </label>
                        <input
                          type="text"
                          value={newMatch.stage}
                          onChange={(e) => setNewMatch({ ...newMatch, stage: e.target.value })}
                          placeholder="e.g. Semi-Finals Day 1"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Status
                        </label>
                        <select
                          value={newMatch.status}
                          onChange={(e) => setNewMatch({ ...newMatch, status: e.target.value as any })}
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        >
                          <option value="UPCOMING">Upcoming</option>
                          <option value="LIVE">Live Broadcast</option>
                          <option value="COMPLETED">Completed Result</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Date (IST)
                        </label>
                        <input
                          type="date"
                          value={newMatch.dateIST}
                          onChange={(e) => setNewMatch({ ...newMatch, dateIST: e.target.value })}
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Time (IST)
                        </label>
                        <input
                          type="text"
                          value={newMatch.timeIST}
                          onChange={(e) => setNewMatch({ ...newMatch, timeIST: e.target.value })}
                          placeholder="18:30 IST"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-mono-code text-[11px] text-[#888888] block mb-1">
                          Placement (If Completed)
                        </label>
                        <input
                          type="text"
                          value={newMatch.placement}
                          onChange={(e) => setNewMatch({ ...newMatch, placement: e.target.value })}
                          placeholder="e.g. 1st Place (Champions 🏆)"
                          className="w-full bg-black border border-[#23242c] rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded bg-[#075BFF] hover:bg-[#1a6cff] text-white text-xs font-mono-code font-bold uppercase transition-colors"
                      >
                        SAVE MATCH ENTRY
                      </button>
                    </div>
                  </form>

                  {/* Existing Matches */}
                  <div className="space-y-2">
                    <span className="font-mono-code text-xs text-[#888888] uppercase block">
                      REGISTERED MATCHES ({matches.length}):
                    </span>
                    <div className="space-y-2">
                      {matches.map((match) => (
                        <div
                          key={match.id}
                          className="p-3 rounded-lg bg-[#111114] border border-[#23242c] flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-white text-sm">
                                {match.tournament}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-white/5 font-mono-code text-[10px] text-[#075BFF]">
                                {match.status}
                              </span>
                            </div>
                            <span className="font-mono-code text-[11px] text-[#888888]">
                              {match.stage} • {match.dateIST} ({match.timeIST})
                            </span>
                          </div>

                          <button
                            onClick={() => deleteMatch(match.id)}
                            className="p-1.5 rounded text-red-400 hover:bg-red-500/10"
                            title="Delete match"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ORG METRICS */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#111114] border border-[#23242c] space-y-4">
                    <span className="font-mono-code text-xs text-white font-bold uppercase block">
                      EDIT HOMEPAGE METRICS (EDITORIAL BENCHMARKS)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {editedStats.map((item, idx) => (
                        <div key={item.id} className="p-3 rounded bg-black border border-[#23242c] space-y-2">
                          <label className="font-mono-code text-[11px] text-[#888888] block uppercase">
                            {item.label}
                          </label>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => {
                              const updated = [...editedStats];
                              updated[idx].value = e.target.value;
                              setEditedStats(updated);
                            }}
                            className="w-full bg-[#111114] border border-[#23242c] rounded p-2 text-sm text-white font-bold"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...editedStats];
                              updated[idx].description = e.target.value;
                              setEditedStats(updated);
                            }}
                            placeholder="Description subtitle"
                            className="w-full bg-[#111114] border border-[#23242c] rounded p-1.5 text-xs text-[#888888]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveStats}
                        className="px-6 py-2.5 rounded bg-[#075BFF] hover:bg-[#1a6cff] text-white text-xs font-mono-code font-bold uppercase transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>UPDATE STATS LIVE</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RECRUITMENT APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-xs text-[#888888] uppercase">
                      RECEIVED TRYOUT APPLICATIONS ({applications.length})
                    </span>
                    <span className="text-[11px] font-mono-code text-[#075BFF]">
                      Stored securely in browser scouting cache
                    </span>
                  </div>

                  {applications.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-[#111114] border border-[#23242c] text-xs font-mono-code text-[#888888]">
                      No tryout applications received yet. Submissions from the JOIN GE form will populate here immediately.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-xl bg-[#111114] border border-[#23242c] space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-code text-xs font-bold text-[#075BFF]">
                                {app.id}
                              </span>
                              <span className="sub-header-pill text-[10px]">
                                {app.preferredRole}
                              </span>
                            </div>
                            <select
                              value={app.status}
                              onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                              className="bg-black border border-[#23242c] text-white text-xs font-mono-code rounded px-2 py-1"
                            >
                              <option value="PENDING REVIEW">PENDING REVIEW</option>
                              <option value="SHORTLISTED">SHORTLISTED</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-[#888888] block text-[10px]">CANDIDATE</span>
                              <span className="font-bold text-white">{app.fullName}</span>
                            </div>
                            <div>
                              <span className="text-[#888888] block text-[10px]">IGN</span>
                              <span className="font-mono-code text-white">{app.ign}</span>
                            </div>
                            <div>
                              <span className="text-[#888888] block text-[10px]">FREE FIRE UID</span>
                              <span className="font-mono-code text-[#075BFF]">{app.uid}</span>
                            </div>
                            <div>
                              <span className="text-[#888888] block text-[10px]">PHONE / DISCORD</span>
                              <span className="text-white">{app.contactPhone}</span>
                            </div>
                          </div>

                          <div className="text-xs space-y-1">
                            <span className="text-[#888888] text-[10px] block">GAMEPLAY HIGHLIGHT URL:</span>
                            <a
                              href={app.gameplayVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#075BFF] font-mono-code underline break-all hover:text-white"
                            >
                              {app.gameplayVideoUrl}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DATABASE / BACKUP / RESET */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#111114] border border-[#23242c] space-y-4">
                    <h4 className="font-display text-base font-bold text-white uppercase">
                      BACKUP &amp; PRODUCTION DEPLOYMENT ENGINE
                    </h4>
                    <p className="text-xs text-[#888888] font-light leading-relaxed">
                      All state changes are automatically saved to your browser's persistent storage.
                      For production deployment, you can connect this interface to PostgreSQL / Supabase / Firebase by configuring backend API routes.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono-code text-xs uppercase border border-white/10 transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#075BFF]" />
                        <span>EXPORT ALL JSON</span>
                      </button>

                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono-code text-xs uppercase border border-white/10 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-[#075BFF]" />
                        <span>IMPORT JSON</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset all website data to initial official defaults?')) {
                            resetAllData();
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono-code text-xs uppercase border border-red-500/30 transition-colors ml-auto"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>RESET TO DEFAULTS</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
