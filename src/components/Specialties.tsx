import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';
import {
  buildWhatsAppUrl,
  CORE_SPECIALTIES,
  PageRoute,
  ServiceName,
  SpecialtyItem,
} from '../data/studioContent';

interface SpecialtiesProps {
  onSelectServiceAndBook: (service: ServiceName) => void;
  onNavigate: (path: PageRoute) => void;
}

const SpecialtyArtwork: React.FC<{ id: string }> = ({ id }) => {
  if (id === 'bridal-makeup') {
    return (
      <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="specGrad1" x1="12" y1="12" x2="108" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E3C4A4" />
            <stop offset="50%" stopColor="#C59B76" />
            <stop offset="100%" stopColor="#9E5E63" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" stroke="url(#specGrad1)" strokeWidth="1" opacity="0.6" />
        <circle cx="60" cy="60" r="44" stroke="url(#specGrad1)" strokeWidth="0.7" strokeDasharray="2 4" opacity="0.55" />
        <path
          d="M42 40L39 30L49 35L60 25L71 35L81 30L78 40C72 38.6 48 38.6 42 40Z"
          stroke="url(#specGrad1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="url(#specGrad1)"
          fillOpacity="0.12"
        />
        <ellipse cx="60" cy="66" rx="20" ry="25" stroke="url(#specGrad1)" strokeWidth="1.4" />
        <path d="M51 64C53.5 61.5 56.5 61.5 59 64" stroke="url(#specGrad1)" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M61 64C63.5 61.5 66.5 61.5 69 64" stroke="url(#specGrad1)" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M55 75C58 77.5 62 77.5 65 75" stroke="#9E5E63" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M60 41V46M36 66H40M80 66H84" stroke="url(#specGrad1)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }

  if (id === 'hairstyles') {
    return (
      <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="specGrad2" x1="12" y1="12" x2="108" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E3C4A4" />
            <stop offset="50%" stopColor="#C59B76" />
            <stop offset="100%" stopColor="#9E5E63" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" stroke="url(#specGrad2)" strokeWidth="1" opacity="0.6" />
        <circle cx="60" cy="60" r="44" stroke="url(#specGrad2)" strokeWidth="0.7" strokeDasharray="2 4" opacity="0.55" />
        <path
          d="M36 74C38 50 48 34 62 34C76 34 84 48 80 64C76 78 62 84 52 78C44 73 46 58 58 56C66 55 70 61 66 68"
          stroke="url(#specGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M44 82C54 88 72 86 84 74" stroke="url(#specGrad2)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
        <circle cx="72" cy="46" r="4.5" stroke="#9E5E63" strokeWidth="1.2" fill="#C59B76" fillOpacity="0.16" />
        <circle cx="79" cy="52" r="3.5" stroke="url(#specGrad2)" strokeWidth="1.1" />
        <circle cx="65" cy="42" r="3" stroke="url(#specGrad2)" strokeWidth="1.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="specGrad3" x1="12" y1="12" x2="108" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E3C4A4" />
          <stop offset="50%" stopColor="#C59B76" />
          <stop offset="100%" stopColor="#9E5E63" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" stroke="url(#specGrad3)" strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="60" r="44" stroke="url(#specGrad3)" strokeWidth="0.7" strokeDasharray="2 4" opacity="0.55" />
      <path d="M36 86C44 64 52 44 60 30C68 44 76 64 84 86" stroke="url(#specGrad3)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M45 88C51 68 56 48 60 32M60 32C64 48 69 68 75 88M60 32V89" stroke="url(#specGrad3)" strokeWidth="1.15" strokeLinecap="round" opacity="0.85" />
      <path d="M38 78C48 74 72 74 82 78" stroke="#9E5E63" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M44 48C54 44 68 44 77 49" stroke="url(#specGrad3)" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="2 2.5" />
    </svg>
  );
};

interface TiltCardProps {
  item: SpecialtyItem;
  index: number;
  isFocused: boolean;
  onFocus: () => void;
  onBook: (service: ServiceName) => void;
}

const SpecialtyTiltCard: React.FC<TiltCardProps> = ({
  item,
  index,
  isFocused,
  onFocus,
  onBook,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 11,
      ry: (x - 0.5) * 12,
      gx: x * 100,
      gy: y * 100,
      active: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1050px' }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onFocus}
        className={`relative h-full rounded-[26px] glass-ivory p-8 sm:p-9 flex flex-col justify-between overflow-hidden transition-all duration-200 ease-out will-change-transform cursor-pointer ${
          isFocused ? 'ring-1 ring-[#9E5E63]/70 shadow-[0_26px_60px_-24px_rgba(158,94,99,0.28)]' : ''
        }`}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.active ? -4 : 0}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: tilt.active ? 1 : 0,
            background: `radial-gradient(380px circle at ${tilt.gx}% ${tilt.gy}%, rgba(197, 155, 118, 0.22), transparent 62%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#8C5257] mb-7">
            <span className="font-semibold tabular-nums">{item.number}</span>
            <span aria-hidden="true" className="h-[1px] flex-1 mx-4 bg-[#C59B76]/35" />
            <span className="truncate">{item.subtitle}</span>
          </div>

          <div className="mb-7 flex items-center justify-start" style={{ transform: 'translateZ(20px)' }}>
            <SpecialtyArtwork id={item.id} />
          </div>

          <h2 className="font-display text-3xl sm:text-[2.1rem] font-semibold text-[#231919] leading-tight mb-4">
            {item.title}
          </h2>
          <p className="text-[15px] leading-[1.7] text-[#4C3939] mb-7">{item.description}</p>

          <ul className="space-y-2.5 pt-5 border-t border-[#C59B76]/28">
            {item.highlights.map((detail) => (
              <li key={detail} className="flex items-center gap-3 text-xs tracking-[0.06em] text-[#5B4545]">
                <span aria-hidden="true" className="w-3 h-[1px] bg-[#C59B76] shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-8 pt-5 border-t border-[#C59B76]/22 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook(item.serviceMatch);
            }}
            className="group inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.15em] uppercase text-[#8C4D53] hover:text-[#231919] transition-colors cursor-pointer py-1"
          >
            <span>Book Now</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <a
            href={buildWhatsAppUrl(
              `Hello Suzan (NS Makeover), I would love to inquire about your ${item.title} services.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] uppercase text-[#6D474A] hover:text-[#9E5E63] transition-colors py-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const Specialties: React.FC<SpecialtiesProps> = ({
  onSelectServiceAndBook,
  onNavigate,
}) => {
  const [focusedId, setFocusedId] = useState<string>(CORE_SPECIALTIES[0].id);
  const activeSpecialty =
    CORE_SPECIALTIES.find((s) => s.id === focusedId) ?? CORE_SPECIALTIES[0];

  return (
    <section className="relative min-h-screen pt-32 pb-24 sm:pt-36 sm:pb-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Back Breadcrumb */}
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-[#8C5257] hover:text-[#231919] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Dedicated Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.28em] uppercase text-[#8E5358] mb-3">
              Core Specialties
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#231919] leading-[1.05]">
              Signature Artistry for Your Most Treasured Moments
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-[1.7] text-[#513D3D]">
            Select any specialty card to inspect our three-step couture craft process or jump directly to booking with Hema Suzan.
          </p>
        </motion.div>

        {/* 3D Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8">
          {CORE_SPECIALTIES.map((specialty, index) => (
            <SpecialtyTiltCard
              key={specialty.id}
              item={specialty}
              index={index}
              isFocused={focusedId === specialty.id}
              onFocus={() => setFocusedId(specialty.id)}
              onBook={onSelectServiceAndBook}
            />
          ))}
        </div>

        {/* Interactive Craft Ritual Spotlight */}
        <div className="mt-14 rounded-[26px] glass-ivory p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#C59B76]/28">
            <div>
              <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[#8C5257] mb-1">
                Interactive Craft Breakdown
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#231919]">
                How We Perfect Your {activeSpecialty.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CORE_SPECIALTIES.map((item) => {
                const selected = item.id === activeSpecialty.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFocusedId(item.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-[0.12em] uppercase transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#231919] text-[#FAF6F2]'
                        : 'bg-[#F3E9E1] text-[#4C3939] hover:text-[#9E5E63]'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpecialty.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {activeSpecialty.craftSteps.map((step, i) => (
                <div key={step} className="space-y-2.5">
                  <p className="font-display text-2xl font-semibold text-[#9E5E63] tabular-nums">
                    0{i + 1}.
                  </p>
                  <p className="text-sm leading-[1.72] text-[#453333]">{step}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-[#C59B76]/25 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/services')}
              className="text-xs font-medium tracking-[0.16em] uppercase text-[#7C444A] hover:text-[#231919] transition-colors cursor-pointer"
            >
              Explore Complete Service Menu →
            </button>

            <button
              type="button"
              onClick={() => onSelectServiceAndBook(activeSpecialty.serviceMatch)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer cursor-pointer"
            >
              <span>Reserve {activeSpecialty.title}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
