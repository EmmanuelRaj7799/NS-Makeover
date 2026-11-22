import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';
import {
  buildWhatsAppUrl,
  FOUNDERS,
  FounderItem,
  PageRoute,
  STUDIO_PILLARS,
} from '../data/studioContent';

interface FoundersProps {
  onNavigate: (path: PageRoute) => void;
}

const GoldFramedPortraitPlaceholder: React.FC<{ founder: FounderItem }> = ({ founder }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[4/5] w-full rounded-[20px] p-3 border border-[#C59B76]/55 bg-gradient-to-b from-[#332324] via-[#261B1C] to-[#1D1415] shadow-[inset_0_1px_0_rgba(230,206,181,0.22)]"
    >
      <div className="relative w-full h-full rounded-[14px] border border-[#C59B76]/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(circle_at_50%_28%,rgba(197,155,118,0.16),rgba(35,25,25,0.92)_72%)]">
        <svg
          viewBox="0 0 240 300"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-65"
          fill="none"
          aria-hidden="true"
        >
          <path d="M18 42V18H42" stroke="#C59B76" strokeWidth="1" />
          <path d="M222 42V18H198" stroke="#C59B76" strokeWidth="1" />
          <path d="M18 258V282H42" stroke="#C59B76" strokeWidth="1" />
          <path d="M222 258V282H198" stroke="#C59B76" strokeWidth="1" />
          <ellipse
            cx="120"
            cy="142"
            rx="72"
            ry="88"
            stroke="#C59B76"
            strokeWidth="0.75"
            strokeDasharray="2 4"
            opacity="0.6"
          />
          <ellipse
            cx="120"
            cy="142"
            rx="62"
            ry="76"
            stroke="#E6CEB5"
            strokeWidth="0.9"
            opacity="0.45"
          />
        </svg>

        <svg viewBox="0 0 48 24" className="w-10 h-5 mb-3 relative z-10" fill="none" aria-hidden="true">
          <path
            d="M8 20L5 8L15 13L24 4L33 13L43 8L40 20C34 18.6 14 18.6 8 20Z"
            stroke="#E6CEB5"
            strokeWidth="1.25"
            strokeLinejoin="round"
            fill="#C59B76"
            fillOpacity="0.16"
          />
        </svg>

        <span className="relative z-10 font-display text-6xl sm:text-7xl font-medium tracking-[0.06em] text-rose-gold-gradient leading-none">
          {founder.monogram}
        </span>

        <div className="relative z-10 w-16 h-[1px] my-4 bg-gradient-to-r from-transparent via-[#C59B76]/80 to-transparent" />

        <p className="relative z-10 text-[11px] tracking-[0.26em] uppercase text-[#E6CEB5]/85">
          NS Makeover Atelier
        </p>
        <p className="relative z-10 mt-1 font-display italic text-sm text-[#D8B491]/80">
          Founder Portrait
        </p>
      </div>
    </motion.div>
  );
};

export const Founders: React.FC<FoundersProps> = ({ onNavigate }) => {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <section className="relative min-h-screen pt-32 pb-24 sm:pt-36 sm:pb-28 text-[#FAF6F2]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#231919]/80 via-[#231919]/72 to-[#231919]/82"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-[#D8B491] hover:text-[#FAF6F2] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Editorial Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14"
        >
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.28em] uppercase text-[#D8B491] mb-3">
              Founders
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#FAF6F2] leading-[1.06]">
              The Visionaries Behind NS Makeover
            </h1>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-[15px] leading-[1.75] text-[#E6D9D1]/85 tracking-[0.01em]">
              United by a shared passion for timeless bridal elegance, personalized styling, and serene, stress-free makeover experiences, Naveen and Hema Suzan founded NS Makeover so every bride steps forward feeling radiant and effortlessly herself.
            </p>
          </div>
        </motion.div>

        {/* Split-Card Luxury Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {FOUNDERS.map((founder, idx) => (
            <motion.article
              key={founder.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[26px] glass-espresso p-7 sm:p-9 grid grid-cols-1 sm:grid-cols-12 gap-7 items-center"
            >
              <div className="sm:col-span-5">
                <GoldFramedPortraitPlaceholder founder={founder} />
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between h-full py-1">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#D8B491] mb-2">
                    {founder.role}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF6F2] leading-tight">
                    {founder.name}
                  </h2>
                  <div className="h-[1px] w-14 my-4 bg-[#C59B76]/55" aria-hidden="true" />
                  <p className="text-sm sm:text-[15px] leading-[1.75] text-[#E6D9D1]/85 tracking-[0.01em]">
                    {founder.bio}
                  </p>
                  <p className="mt-4 font-display italic text-base text-[#E6CEB5]/90 leading-relaxed">
                    “{founder.signatureNote}”
                  </p>
                </div>

                <p className="mt-6 pt-4 border-t border-[#C59B76]/20 text-[11px] tracking-[0.16em] uppercase text-[#D8B491]/90">
                  {founder.focus}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Interactive Atelier Philosophy Pillars */}
        <div className="mt-12 rounded-[26px] glass-espresso p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-7 border-b border-[#C59B76]/22">
            <div>
              <p className="font-script text-3xl sm:text-4xl text-[#E6CEB5] mb-1">
                Crafted with Grace &amp; Devotion
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6F2]">
                Our Three Studio Pillars
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {STUDIO_PILLARS.map((pillar, i) => (
                <button
                  key={pillar.number}
                  type="button"
                  onClick={() => setActivePillar(i)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                    activePillar === i
                      ? 'bg-[#E6CEB5] text-[#231919]'
                      : 'border border-[#C59B76]/35 text-[#E6D9D1]/80 hover:border-[#E6CEB5]'
                  }`}
                >
                  {pillar.number} · {pillar.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={STUDIO_PILLARS[activePillar].number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-8">
                <p className="text-xs tracking-[0.22em] uppercase text-[#D8B491] mb-2">
                  Pillar {STUDIO_PILLARS[activePillar].number}
                </p>
                <h3 className="font-display text-3xl font-semibold text-[#FAF6F2] mb-3">
                  {STUDIO_PILLARS[activePillar].title}
                </h3>
                <p className="text-sm sm:text-base leading-[1.78] text-[#E6D9D1]/85 max-w-2xl">
                  {STUDIO_PILLARS[activePillar].detail}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('/book')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer cursor-pointer whitespace-nowrap"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <a
                  href={buildWhatsAppUrl(
                    'Hello Suzan (NS Makeover), I just read about your story and would love to discuss my upcoming event!',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] border border-[#C59B76]/50 hover:bg-[#C59B76]/15 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#E6CEB5]" />
                  <span>Message Hema Suzan</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
