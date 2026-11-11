import React from 'react';
import { ArrowUpRight, Users, Shield, Heart, MessageSquare } from 'lucide-react';
import { BRAND, INITIAL_INSTAGRAM_POSTS } from '../data/initialData';
import { InstagramIcon, YouTubeIcon, DiscordIcon } from './SocialIcons';

export const CommunitySection: React.FC = () => {
  const socialCards = [
    {
      id: 'soc-ig',
      title: 'INSTAGRAM',
      handle: BRAND.instagramHandle,
      stats: '45K+ SUPPORTERS',
      description: 'Behind-the-scenes boot camp access, player lifestyle clips, matchday reels, and official giveaway announcements.',
      url: BRAND.instagram,
      icon: InstagramIcon,
      accent: '#E1306C',
      gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      glow: 'shadow-[0_0_35px_rgba(225,48,108,0.25)]',
      border: 'hover:border-[#E1306C]',
      cta: 'FOLLOW @ind_greniteesp',
    },
    {
      id: 'soc-yt',
      title: 'YOUTUBE BROADCAST',
      handle: '@-grenite07',
      stats: 'OFFICIAL CHANNEL',
      description: 'Official competitive montages, tournament live match streams, tactical breakdown podcasts, and squad highlights.',
      url: BRAND.youtube,
      icon: YouTubeIcon,
      accent: '#FF0000',
      gradient: 'from-[#FF0000] to-[#CC0000]',
      glow: 'shadow-[0_0_35px_rgba(255,0,0,0.25)]',
      border: 'hover:border-[#FF0000]',
      cta: 'SUBSCRIBE ON YOUTUBE',
    },
    {
      id: 'soc-dc',
      title: 'DISCORD SCRIM HUB',
      handle: 'discord.gg/YgwX4sSkx',
      stats: 'OFFICIAL SERVER',
      description: 'Daily competitive scrim lobbies, Free Fire custom room codes, roster tryout announcements, and member tournaments.',
      url: BRAND.discord,
      icon: DiscordIcon,
      accent: '#5865F2',
      gradient: 'from-[#5865F2] to-[#404EED]',
      glow: 'shadow-[0_0_35px_rgba(88,101,242,0.25)]',
      border: 'hover:border-[#5865F2]',
      cta: 'JOIN OUR DISCORD SERVER',
    },
    {
      id: 'soc-join',
      title: 'JOIN GE ESPORTS',
      handle: 'SCOUTING DESK',
      stats: 'TIER-1 TRYOUTS OPEN',
      description: 'Step onto the national stage. Submit your Free Fire competitive credentials, match UID, and gameplay highlights.',
      url: '#join',
      icon: Shield,
      accent: '#00F0FF',
      gradient: 'from-[#075BFF] via-[#8B5CF6] to-[#00F0FF]',
      glow: 'shadow-[0_0_35px_rgba(0,240,255,0.25)]',
      border: 'hover:border-[#00F0FF]',
      cta: 'APPLY FOR SCOUTING',
      internal: true,
    },
  ];

  return (
    <section id="community" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-[#075BFF]/10 via-[#8B5CF6]/15 to-[#00F0FF]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#26213D] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <Users className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>COMMUNITY ECOSYSTEM</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">STORM SQUAD</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              Connect with thousands of dedicated esports fans and aspiring athletes across India. Follow our daily grind, live scrims, and exclusive drops.
            </p>
          </div>

          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] hover:brightness-110 text-white font-orbitron text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(7,91,255,0.4)] transition-all shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>CONNECT WITH US</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Animated Social Media Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {socialCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.id}
                href={card.url}
                target={card.internal ? '_self' : '_blank'}
                rel={card.internal ? '' : 'noopener noreferrer'}
                className={`group relative rounded-2xl bg-[#120F1F] border border-[#26213D] transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.7)] ${card.border} hover:-translate-y-2 hover:${card.glow}`}
              >
                {/* Subtle Gradient Backlight */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-30 blur-2xl transition-opacity pointer-events-none"
                  style={{ backgroundColor: card.accent }}
                />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${card.accent}20` }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="font-mono-code text-[11px] font-bold text-white bg-black/60 px-2.5 py-1 rounded border border-white/10">
                      {card.stats}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-orbitron text-lg font-black text-white uppercase tracking-tight group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <span className="font-mono-code text-xs text-[#00F0FF]">
                      {card.handle}
                    </span>
                  </div>

                  <p className="font-rajdhani text-xs sm:text-sm text-[#8E8A9F] leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-orbitron font-bold text-white group-hover:underline">
                  <span>{card.cta}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Live Instagram Feed Reel Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C] animate-pulse" />
              <span className="font-orbitron text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                FEATURED INSTAGRAM BROADCASTS
              </span>
            </div>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-code text-xs text-[#00F0FF] hover:underline flex items-center gap-1"
            >
              <span>VIEW ALL ON INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#8B5CF6] transition-all duration-300 overflow-hidden flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-black">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-80" />

                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white">
                    <InstagramIcon className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono-code text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#00F0FF]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8E8A9F]">{post.date}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <p className="font-rajdhani text-xs sm:text-sm text-[#DDE1E8]/85 font-medium line-clamp-2">
                    {post.caption}
                  </p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-orbitron font-bold text-[#00F0FF] group-hover:underline">
                    <span>VIEW POST</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
