import React from 'react';
import { ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';
import { BRAND } from '../data/initialData';
import { InstagramIcon } from './SocialIcons';


export const InstagramSection: React.FC = () => {
  const { instagramPosts } = useEsports();

  return (
    <section className="relative py-20 lg:py-28 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#23242c] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <InstagramIcon className="w-3.5 h-3.5 text-[#075BFF]" />
              <span>OFFICIAL SOCIAL FEED</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              FOLLOW THE <span className="text-[#075BFF]">MOVEMENT</span>
            </h2>
            <p className="text-sm sm:text-base text-[#888888] max-w-xl font-light">
              The journey continues beyond the battlefield. Real-time updates, player stories, tournament diaries, and exclusive drops on our official Instagram feed.
            </p>
          </div>

          {/* Follow Button directly linking to official profile */}
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#075BFF] to-[#1a6cff] hover:from-[#1a6cff] hover:to-[#075BFF] text-white font-mono-code text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(7,91,255,0.35)] transition-all shrink-0 group"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>FOLLOW @ind_greniteesp</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Instagram Post Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl bg-[#111114] border border-[#23242c] hover:border-[#075BFF] transition-all duration-300 overflow-hidden flex flex-col shadow-lg"
            >
              {/* Image with hover zoom */}
              <div className="relative aspect-square w-full overflow-hidden bg-black">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Floating Instagram Corner Icon */}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white group-hover:text-[#075BFF] transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </div>


                {/* Bottom Overlay stats */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono-code text-white/90">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#075BFF]" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-[#888888]">{post.date}</span>
                </div>
              </div>

              {/* Caption snippet */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#DDE1E8]/85 font-light line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono-code text-[11px] text-[#075BFF] group-hover:underline">
                  <span>VIEW ON INSTAGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Community engagement bar */}
        <div className="mt-10 p-5 rounded-xl bg-[#111114] border border-[#23242c] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#075BFF] animate-ping shrink-0 hidden sm:block"></span>
            <div>
              <span className="font-display text-sm font-bold text-white uppercase block">
                JOIN THE #STORM SQUAD COMMUNITY
              </span>
              <span className="text-xs text-[#888888] font-light">
                Tag @ind_greniteesp on Instagram with your gameplay clips to be featured on our official channel.
              </span>
            </div>
          </div>

          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-xs font-mono-code text-white border border-white/10 transition-colors shrink-0"
          >
            OPEN @ind_greniteesp
          </a>
        </div>
      </div>
    </section>
  );
};
