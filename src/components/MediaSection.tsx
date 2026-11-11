import React, { useState, useRef } from 'react';
import { Play, Film, X, ExternalLink, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';

export const MediaSection: React.FC = () => {
  const { media, selectedMedia, setSelectedMedia } = useEsports();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    'ALL',
    'HIGHLIGHTS',
    'SPOTLIGHTS',
    'REELS & SHORTS',
    'ANNOUNCEMENTS',
  ] as const;

  // Extended media gallery with screenshots and tournament photos
  const galleryItems = [
    ...media,
    {
      id: 'photo-1',
      title: 'Grand Finals Arena Victory Celebration — Stage Confetti Booyah',
      category: 'HIGHLIGHTS' as const,
      thumbnail: '/images/hero.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '04:10',
      date: 'OCT 2026',
      views: '52K Views',
    },
    {
      id: 'photo-2',
      title: 'Tactical War Room: High-Pressure Zone Rotation Analysis with IGL Krishna',
      category: 'SPOTLIGHTS' as const,
      thumbnail: '/images/arena.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '05:30',
      date: 'OCT 2026',
      views: '34K Views',
    },
  ];

  const filteredMedia = galleryItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section id="media" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#26213D] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <Film className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>CINEMATIC ARCHIVES</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              MEDIA &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">HIGHLIGHTS</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              High-octane tournament clutches, 4K gameplay montages, tournament snapshots, and tactical replay archives.
            </p>
          </div>

          {/* Navigation Controls & Categories */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-orbitron text-xs transition-all uppercase whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white font-bold shadow-[0_0_15px_rgba(7,91,255,0.4)]'
                      : 'bg-[#120F1F] text-[#8E8A9F] hover:text-white border border-[#26213D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2">
              <button
                onClick={() => scrollGallery('left')}
                className="p-2.5 rounded-xl bg-[#120F1F] border border-[#26213D] text-[#8E8A9F] hover:text-white hover:border-[#00F0FF] transition-colors"
                aria-label="Scroll media left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="p-2.5 rounded-xl bg-[#120F1F] border border-[#26213D] text-[#8E8A9F] hover:text-white hover:border-[#00F0FF] transition-colors"
                aria-label="Scroll media right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontally Arranged Floating 3D Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory perspective-1200"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="snap-start shrink-0 w-80 sm:w-96 rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#00F0FF] transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_40px_rgba(0,240,255,0.2)] hover:-translate-y-2"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F1F] via-black/30 to-transparent" />

                {/* Floating Play Button with Pulse Aura */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white flex items-center justify-center shadow-[0_0_30px_rgba(7,91,255,0.6)] group-hover:scale-115 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current ml-0.5 text-white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 font-mono-code text-[10px] text-white flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
                  <Clock className="w-3 h-3 text-[#00F0FF]" />
                  <span>{item.duration}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 font-orbitron text-[10px] font-bold text-[#00F0FF] border border-[#00F0FF]/40 backdrop-blur-md">
                  {item.category}
                </div>
              </div>

              {/* Title & Stats */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <h3 className="font-orbitron text-sm sm:text-base font-bold text-white line-clamp-2 group-hover:text-[#00F0FF] transition-colors leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-xs font-mono-code text-[#8E8A9F] pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{item.views || '25K Views'}</span>
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-[#120F1F] border border-[#26213D] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#26213D] bg-[#08060D]">
              <div className="flex items-center gap-2 truncate pr-4">
                <span className="sub-header-pill text-[10px] shrink-0">
                  {selectedMedia.category}
                </span>
                <span className="font-orbitron text-sm font-bold text-white truncate">
                  {selectedMedia.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 rounded-lg text-[#8E8A9F] hover:text-white hover:bg-white/5 shrink-0 transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Iframe */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${selectedMedia.videoUrl}?autoplay=1`}
                title={selectedMedia.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Footer info */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-[#120F1F]">
              <div className="space-y-1">
                <div className="font-mono-code text-xs text-[#8E8A9F]">
                  OFFICIAL GE BROADCAST ARCHIVE // {selectedMedia.duration} RUNTIME
                </div>
              </div>

              <a
                href={BRAND.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
              >
                <span>SUBSCRIBE ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
