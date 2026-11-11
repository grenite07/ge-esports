import React, { useState } from 'react';
import { ShoppingBag, Bell, Check, X, ChevronRight } from 'lucide-react';
import { useEsports } from '../context/EsportsContext';

export const CollectionSection: React.FC = () => {
  const { merch, selectedMerch, setSelectedMerch, showToast } = useEsports();
  const [notifyEmail, setNotifyEmail] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      showToast('Please enter a valid email address to receive launch alerts', 'error');
      return;
    }
    setIsSubmitted(true);
    showToast(`You have joined the priority drop list for ${selectedMerch?.name || 'the GE Collection'}!`, 'success');
    setTimeout(() => {
      setIsSubmitted(false);
      setNotifyEmail('');
      setSelectedMerch(null);
    }, 2000);
  };

  return (
    <section id="collection" className="relative py-24 sm:py-32 bg-[#08060D] border-t border-[#26213D] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#075BFF]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#26213D] gap-6">
          <div className="space-y-3">
            <div className="sub-header-pill">
              <ShoppingBag className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>OFFICIAL APPAREL &amp; LIFESTYLE DROP</span>
            </div>
            <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              THE GE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#075BFF] to-[#8B5CF6]">COLLECTION</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8A9F] font-rajdhani font-medium max-w-xl">
              Engineered pro jerseys, 420 GSM heavyweight streetwear hoodies, and collector edition graphics crafted for champions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-xl bg-[#120F1F] border border-[#26213D] font-mono-code text-xs text-[#00F0FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>UPCOMING LIMITED DROP 2026</span>
            </span>
          </div>
        </div>

        {/* 3D Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {merch.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMerch(item)}
              className="group relative cursor-pointer rounded-2xl bg-[#120F1F] border border-[#26213D] hover:border-[#8B5CF6] transition-all duration-300 overflow-hidden flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.25)] hover:-translate-y-1"
            >
              {/* Product Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 font-orbitron text-[9px] font-bold text-white uppercase tracking-wider">
                  {item.badge}
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2.5 py-1 rounded-md bg-[#075BFF]/80 backdrop-blur-md font-orbitron text-[9px] font-bold text-white uppercase shadow-md">
                  {item.availability}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#08060D] p-6 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain filter group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F1F] via-transparent to-transparent opacity-60" />
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-mono-code text-[10px] text-[#8E8A9F] uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-orbitron text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-orbitron text-lg font-black text-white">
                      ₹{item.priceINR}
                    </span>
                    <span className="text-xs font-mono-code text-[#8E8A9F] ml-1.5">
                      (${item.priceUSD})
                    </span>
                  </div>

                  <span className="text-xs font-orbitron font-bold text-[#00F0FF] flex items-center gap-1 group-hover:underline">
                    <span>VIEW DROP</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Quick View / Notify Me Modal */}
      {selectedMerch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedMerch(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#120F1F] border border-[#26213D] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#26213D] bg-[#08060D]">
              <span className="font-orbitron text-xs text-[#00F0FF] uppercase tracking-widest">
                GE COLLECTION // APPAREL SPECIFICATIONS
              </span>
              <button
                onClick={() => setSelectedMerch(null)}
                className="p-1.5 rounded-lg text-[#8E8A9F] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative w-44 h-44 rounded-xl bg-[#08060D] border border-[#26213D] overflow-hidden p-3 shrink-0">
                  <img
                    src={selectedMerch.image}
                    alt={selectedMerch.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <span className="sub-header-pill text-[10px]">
                    {selectedMerch.availability}
                  </span>
                  <h3 className="font-orbitron text-2xl font-black text-white uppercase tracking-tight">
                    {selectedMerch.name}
                  </h3>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="font-orbitron text-2xl font-black text-white">
                      ₹{selectedMerch.priceINR}
                    </span>
                    <span className="text-xs font-mono-code text-[#8E8A9F]">
                      (${selectedMerch.priceUSD} USD Est.)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#8E8A9F] font-rajdhani">
                    {selectedMerch.description}
                  </p>
                </div>
              </div>

              {/* Sizing selector */}
              <div className="space-y-2">
                <span className="font-orbitron text-xs text-white uppercase block">
                  SELECT SIZE (INDIAN &amp; GLOBAL SIZING):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedMerch.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-lg font-orbitron text-xs font-bold transition-all border ${
                        selectedSize === sz
                          ? 'bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] text-white border-white/20 shadow-md'
                          : 'bg-[#08060D] text-[#8E8A9F] border-[#26213D] hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material & Feature list */}
              <div className="space-y-2">
                <span className="font-orbitron text-xs text-white uppercase block">
                  FABRIC &amp; SPECIFICATIONS:
                </span>
                <ul className="grid sm:grid-cols-2 gap-2 text-xs text-[#DDE1E8]/85 font-rajdhani font-medium">
                  {selectedMerch.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#08060D] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[#00F0FF] font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notify Me Registration Form */}
              <div className="pt-4 border-t border-[#26213D] space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00F0FF]" />
                  <span className="font-orbitron text-xs font-bold text-white uppercase">
                    RECEIVE PRIORITY DROP ALERT FOR SIZE {selectedSize}
                  </span>
                </div>

                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Enter your email for early drop access..."
                    className="flex-1 bg-[#08060D] border border-[#26213D] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#075BFF] to-[#8B5CF6] hover:brightness-110 text-white font-orbitron text-xs font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    {isSubmitted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>REGISTERED</span>
                      </>
                    ) : (
                      <>
                        <span>NOTIFY ME</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
