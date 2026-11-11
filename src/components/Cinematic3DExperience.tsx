import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

interface CinematicCard {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  accent: string;
  description: string;
  stats: { label: string; value: string }[];
}

export const Cinematic3DExperience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<CinematicCard | null>(null);
  const isScrollingRef = useRef(false);

  // 12 curated gaming artwork cards (balanced for smooth 60fps & visual impact)
  const deck: CinematicCard[] = [
    {
      id: 'c-1',
      title: 'BERMUDA DOMINANCE',
      subtitle: 'Zone Retention & Macro Calling',
      tag: 'FFIC TIER-1',
      image: '/images/arena.jpg',
      accent: '#00F0FF',
      description: 'Tactical macro positioning by Captain Krishna. Flawless zone prediction and high ground retention during the Free Fire India Championship qualifiers.',
      stats: [
        { label: 'ZONE RETENTION', value: '94%' },
        { label: 'PLACEMENT', value: '1ST BOOYAH' },
        { label: 'MAP', value: 'BERMUDA' },
      ],
    },
    {
      id: 'c-2',
      title: 'GRAND FINALS TROPHY',
      subtitle: 'Battle Arena S4 National Silverware',
      tag: 'CHAMPIONS 🏆',
      image: '/images/hero.jpg',
      accent: '#8B5CF6',
      description: 'The crowning moment of GE Esports in Battle Arena Season 4. 52 squad kills and 118 points to seize the national trophy.',
      stats: [
        { label: 'POINTS', value: '118 PTS' },
        { label: 'KILLS', value: '52 FRAGS' },
        { label: 'TROPHY', value: 'GOLD CUP' },
      ],
    },
    {
      id: 'c-3',
      title: 'ADITYA AWM CLINIC',
      subtitle: '292m Penetration Knockdown',
      tag: 'SNIPER // AWM',
      image: '/images/player1.jpg',
      accent: '#F59E0B',
      description: 'The sniper masterclass delivered by Aditya. Armed with dual AWMs and anti-material rifles, picking off enemies through vehicle armor at 292 meters.',
      stats: [
        { label: 'DISTANCE', value: '292 METERS' },
        { label: 'HEADSHOT %', value: '88%' },
        { label: 'WEAPON', value: 'AWM + M82B' },
      ],
    },
    {
      id: 'c-4',
      title: 'AQUA ENTRY BREACH',
      subtitle: 'Fastest Squad Wipe (12s)',
      tag: 'PRIMARY RUSHER',
      image: '/images/hero.jpg',
      accent: '#00F0FF',
      description: 'High-velocity Gloo-wall breaching. Opening duels resolved in milliseconds with lightning close-range M1887 and Charge Buster snaps.',
      stats: [
        { label: 'FIRST BLOOD', value: '94%' },
        { label: 'ENTRY SPEED', value: '0.42 SEC' },
        { label: 'WINRATE', value: '89%' },
      ],
    },
    {
      id: 'c-5',
      title: 'PRO ARMOR 2026',
      subtitle: 'Aerodry Sublimated Competition Kit',
      tag: 'WAR APPAREL',
      image: '/images/jersey.jpg',
      accent: '#8B5CF6',
      description: 'Aerodynamic moisture-wicking micro-mesh jersey emblazoned with the official Grenite electric crest. Engineered for stage lighting and athletic focus.',
      stats: [
        { label: 'FABRIC', value: 'AERODRY' },
        { label: 'EDITION', value: '2026 PRO' },
        { label: 'CREST', value: 'SILICONE' },
      ],
    },
    {
      id: 'c-6',
      title: 'TACTICAL OVERWATCH',
      subtitle: 'Soumik & Sufiyan Flank Security',
      tag: 'CROSSFIRE ANCHOR',
      image: '/images/arena.jpg',
      accent: '#075BFF',
      description: 'Soumik, Sufiyan, and Sanatani holding secondary crossfire angles to prevent third-party interruptions while primary rushers collapse the perimeter.',
      stats: [
        { label: 'CROSSFIRE DMG', value: '4.8K' },
        { label: 'REVIVE SUCCESS', value: '92%' },
        { label: 'ANCHOR ROLE', value: 'DEFENSIVE' },
      ],
    },
    {
      id: 'c-7',
      title: 'STORM HOODIE DROP',
      subtitle: '420 GSM Heavyweight Streetwear',
      tag: 'LIFESTYLE',
      image: '/images/hoodie.jpg',
      accent: '#8B5CF6',
      description: 'Ultra-heavyweight French Terry streetwear hoodie with 3M reflective iconography and electric blue embroidered shield monogram.',
      stats: [
        { label: 'WEIGHT', value: '420 GSM' },
        { label: 'MATERIAL', value: 'COMBED COTTON' },
        { label: 'CUT', value: 'BOXY OVERSIZED' },
      ],
    },
    {
      id: 'c-8',
      title: 'CIRCUITRY SHADOW',
      subtitle: 'Perimeter Cutoff & Vehicle Ambush',
      tag: 'SANATANI // RUSHER',
      image: '/images/player1.jpg',
      accent: '#00F0FF',
      description: 'Ruthless perimeter rusher and zone cutoff specialist. Anticipates rival team rotations outside safe circles and inflicts maximum structural damage.',
      stats: [
        { label: 'ROTATION CUT', value: '98%' },
        { label: 'DPS BURST', value: '620' },
        { label: 'WEAPON', value: 'GROZA + M1014' },
      ],
    },
    {
      id: 'c-9',
      title: 'KARAN ASSAULT DRILL',
      subtitle: 'Corner Pre-Firing & Double Frag',
      tag: 'PRIMARY RUSHER',
      image: '/images/hero.jpg',
      accent: '#075BFF',
      description: 'High-velocity combat rusher specializing in close-quarters flank wipes and multi-kill entries in fast-paced squad engagements.',
      stats: [
        { label: 'K/D RATIO', value: '4.52' },
        { label: 'CLUTCH %', value: '82%' },
        { label: 'MAIN GUN', value: 'MP40 EVO' },
      ],
    },
    {
      id: 'c-10',
      title: 'TAWBAN MOMENTUM',
      subtitle: 'Relentless Hot-Drop Contender',
      tag: 'PRIMARY RUSHER',
      image: '/images/player1.jpg',
      accent: '#8B5CF6',
      description: 'Dominates hot-drop contests on Bermuda and Kalahari with pinpoint spray control and rapid Gloo utility deployment.',
      stats: [
        { label: 'K/D RATIO', value: '4.38' },
        { label: 'CLUTCH %', value: '80%' },
        { label: 'MAIN GUN', value: 'THOMPSON' },
      ],
    },
    {
      id: 'c-11',
      title: 'RED BULL MASTERS',
      subtitle: 'Super Weekend Silver Podium',
      tag: 'PODIUM 🥈',
      image: '/images/arena.jpg',
      accent: '#8B5CF6',
      description: 'Super Weekend podium finish with 3 Booyahs and the highest defensive zone survival score in tournament history.',
      stats: [
        { label: 'POINTS', value: '92 PTS' },
        { label: 'KILLS', value: '41 FRAGS' },
        { label: 'BOOYAHS', value: '3 WINS' },
      ],
    },
    {
      id: 'c-12',
      title: 'SYNTHETICA SAPIENS',
      subtitle: 'Futuristic Cyberpunk Visual Archetype',
      tag: 'CONCEPT',
      image: '/images/hero.jpg',
      accent: '#00F0FF',
      description: 'Visual harmony between human mechanical reflex and digital tactical analytics.',
      stats: [
        { label: 'STYLE', value: '3D CYBER' },
        { label: 'FREQUENCY', value: '165 HZ' },
        { label: 'ERA', value: '2026' },
      ],
    },
  ];

  // Highly optimized scroll listener with requestAnimationFrame & hysteresis
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current || isScrollingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollable = rect.height - windowHeight;

          if (totalScrollable > 0) {
            const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
            const newStage =
              progress < 0.25 ? 0 : progress < 0.52 ? 1 : progress < 0.76 ? 2 : 3;

            setCurrentStage((prev) => (prev !== newStage ? newStage : prev));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToStage = (stageIdx: number) => {
    setCurrentStage(stageIdx);
    if (sectionRef.current) {
      isScrollingRef.current = true;
      const rect = sectionRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const sectionTop = currentScrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      const targetScroll = sectionTop + (stageIdx / 3) * totalScrollable;

      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    }
  };

  // Hardware-accelerated 3D Transform calculations for 60fps performance
  const getCardTransform = (index: number) => {
    // STAGE 0 (0s - 2s): 3D Cluster (2 rows of 3)
    if (currentStage === 0) {
      if (index >= 6) {
        return { display: 'none' as const };
      }
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = (col - 1) * 270;
      const y = row === 0 ? -140 : 140;
      const z = row === 0 ? (col === 1 ? -30 : 10) : (col === 1 ? 50 : 25);
      const rotateY = (col - 1) * 10;
      const rotateX = row === 0 ? 8 : -6;

      return {
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        opacity: 1,
        zIndex: 20 + z,
      };
    }

    // STAGE 1 (4s): 3D Angled Stacked Deck on Right Side
    if (currentStage === 1) {
      if (index >= 6) {
        return { display: 'none' as const };
      }
      const step = index;
      const x = 140 + step * 26;
      const y = -120 + step * 28;
      const z = step * 35;
      const rotateY = -36;
      const rotateX = 16;
      const rotateZ = -8;

      return {
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
        opacity: 1,
        zIndex: 40 + step,
      };
    }

    // STAGE 2 (6s - 8s): Horizontal 3D Perspective Horizon Row
    if (currentStage === 2) {
      if (index >= 5) {
        return { display: 'none' as const };
      }
      const centerOffset = index - 2;
      const x = centerOffset * 250;
      const y = -80;
      const z = 30 - Math.abs(centerOffset) * 40;
      const rotateX = 20;
      const rotateY = centerOffset * -8;

      return {
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        opacity: 1,
        zIndex: 30 + z,
      };
    }

    // STAGE 3 (12s): Grand 3D Serpentine Helix / Ribbon (12 cards)
    const total = deck.length;
    const t = index / (total - 1);
    const startX = 380;
    const endX = -400;
    const startY = 220;
    const endY = -210;
    const startZ = 180;
    const endZ = -380;

    const x = startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * 75;
    const y = startY + (endY - startY) * t;
    const z = startZ + (endZ - startZ) * t;
    const rotateY = -42 + t * 40;
    const rotateX = 22 - t * 18;
    const rotateZ = -18 + t * 20;

    return {
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
      opacity: 0.95 - t * 0.2,
      zIndex: Math.round(50 - t * 40),
    };
  };

  return (
    <section
      ref={sectionRef}
      id="3d-experience"
      className="relative min-h-[280vh] bg-[#08060D]"
    >
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none perspective-1200">
        {/* Soft Ambient Purple Vignette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#8B5CF6]/12 to-[#075BFF]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* TOP HUD BAR */}
        <div className="relative z-30 flex flex-wrap items-center justify-between w-full max-w-7xl mx-auto pt-2 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="font-orbitron text-xs sm:text-sm font-black text-white tracking-widest uppercase">
              {currentStage === 0 && 'STAGE 01 // 3D CLUSTER'}
              {currentStage === 1 && 'STAGE 02 // ANGLED DECK'}
              {currentStage === 2 && 'STAGE 03 // HORIZON REVEAL'}
              {currentStage === 3 && 'STAGE 04 // SERPENTINE HELIX'}
            </span>
          </div>

          {/* Direct Stage Navigation Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#120F1F] border border-[#26213D]">
            {(
              [
                { id: 0, label: '01 CLUSTER' },
                { id: 1, label: '02 STACK' },
                { id: 2, label: '03 HORIZON' },
                { id: 3, label: '04 HELIX' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                onClick={() => goToStage(st.id)}
                className={`px-3 py-1.5 rounded-lg font-orbitron text-[10px] font-bold uppercase transition-colors ${
                  currentStage === st.id
                    ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white shadow-md'
                    : 'text-[#8E8A9F] hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER 3D VIEWPORT */}
        <div className="relative flex-1 w-full flex items-center justify-center transform-style-3d">
          {/* Typography Reveals matching reference video */}
          {currentStage === 0 && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
              <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                THE NEXT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6]">EVOLUTION</span>
              </h2>
            </div>
          )}

          {currentStage === 1 && (
            <div className="absolute left-6 sm:left-14 bottom-14 sm:bottom-20 max-w-sm pointer-events-none z-10">
              <span className="sub-header-pill text-[10px] mb-2">STAGE 02 // DOMINANCE</span>
              <h2 className="font-orbitron text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
                A NEW <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">
                  FRONTIER
                </span>
              </h2>
              <p className="font-orbitron text-xs sm:text-sm text-[#8E8A9F] tracking-widest uppercase mt-2">
                CHRONICLES OF CIRCUITRY
              </p>
            </div>
          )}

          {currentStage === 2 && (
            <div className="absolute inset-0 flex flex-col justify-between items-center py-12 pointer-events-none z-10">
              <div className="text-center">
                <h2 className="font-orbitron text-4xl sm:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">
                  SYNTHETICA <span className="text-[#8B5CF6]">SAPIENS</span>
                </h2>
              </div>
              <div className="text-center">
                <h3 className="font-orbitron text-2xl sm:text-4xl font-black text-[#DDE1E8] uppercase tracking-widest drop-shadow-lg">
                  A NEW FRONTIER
                </h3>
              </div>
            </div>
          )}

          {currentStage === 3 && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
              <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                SYNTHETICA <span className="text-[#00F0FF]">SAPIENS</span>
              </h2>
              <span className="font-orbitron text-xs text-[#8E8A9F] tracking-[0.25em] uppercase block mt-1">
                UNLEASH THE STORM // 3D HELIX
              </span>
            </div>
          )}

          {/* 3D Cards Container (Using hardware accelerated translate3d) */}
          <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
            {deck.map((card, index) => {
              const cardProps = getCardTransform(index);

              if ('display' in cardProps && cardProps.display === 'none') {
                return null;
              }

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  style={{
                    transform: cardProps.transform,
                    opacity: cardProps.opacity,
                    zIndex: cardProps.zIndex,
                    borderColor: `${card.accent}55`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                    transition: 'transform 0.45s ease-out, opacity 0.3s ease',
                  }}
                  className="absolute w-52 sm:w-60 lg:w-68 aspect-[3/4.2] rounded-2xl bg-[#120F1F] border shadow-[0_15px_35px_rgba(0,0,0,0.7)] cursor-pointer group hover:border-[#00F0FF] overflow-hidden"
                >
                  <div className="relative w-full h-full overflow-hidden bg-[#08060D]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-[#08060D]/40 to-transparent opacity-90" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <span
                        className="px-2 py-0.5 rounded font-orbitron text-[9px] font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${card.accent}20`,
                          borderColor: `${card.accent}50`,
                          color: card.accent,
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 z-20 space-y-1">
                      <h4 className="font-orbitron text-xs sm:text-sm font-black text-white uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors truncate">
                        {card.title}
                      </h4>
                      <p className="font-rajdhani text-[11px] text-[#DDE1E8]/75 truncate font-medium">
                        {card.subtitle}
                      </p>

                      <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono-code border-t border-white/10">
                        <span style={{ color: card.accent }}>INSPECT →</span>
                        <span className="text-[#8E8A9F]">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto pb-2 text-xs font-mono-code text-[#8E8A9F]">
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-[#00F0FF] font-bold">
              STAGE 0{currentStage + 1} / 04
            </span>
          </div>

          {currentStage === 0 && (
            <div className="flex items-center gap-1.5 text-white font-orbitron text-xs animate-bounce">
              <span>Scroll into the future</span>
              <ChevronDown className="w-4 h-4 text-[#00F0FF]" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToStage(Math.max(0, currentStage - 1))}
              disabled={currentStage === 0}
              className="p-1 rounded bg-[#120F1F] border border-[#26213D] disabled:opacity-30 hover:text-white"
              title="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goToStage(Math.min(3, currentStage + 1))}
              disabled={currentStage === 3}
              className="p-1 rounded bg-[#120F1F] border border-[#26213D] disabled:opacity-30 hover:text-white"
              title="Next Stage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Inspector Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl bg-[#120F1F] border border-[#26213D] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#26213D] bg-[#08060D]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#00F0FF]" />
                <span className="font-orbitron text-xs sm:text-sm font-bold text-white uppercase">
                  {selectedCard.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-lg text-[#8E8A9F] hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#26213D]">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-orbitron text-xl font-black text-white uppercase mb-1">
                  {selectedCard.title}
                </h3>
                <p className="font-rajdhani text-sm text-[#DDE1E8]/85 font-medium">
                  {selectedCard.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {selectedCard.stats.map((st, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#08060D] border border-[#26213D] text-center"
                  >
                    <span className="font-mono-code text-[10px] text-[#8E8A9F] uppercase block">
                      {st.label}
                    </span>
                    <span
                      className="font-orbitron text-sm font-black block"
                      style={{ color: selectedCard.accent }}
                    >
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end border-t border-white/5">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white font-orbitron text-xs font-bold uppercase tracking-wider"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
