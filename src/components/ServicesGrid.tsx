import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Plus } from 'lucide-react';
import {
  ALL_SERVICES,
  buildWhatsAppUrl,
  PageRoute,
  ServiceCategoryFilter,
  ServiceName,
} from '../data/studioContent';

interface ServicesGridProps {
  selectedServices: ServiceName[];
  onToggleService: (service: ServiceName) => void;
  onNavigate: (path: PageRoute) => void;
}

const FILTER_OPTIONS: ServiceCategoryFilter[] = [
  'All',
  'Bridal',
  'Styling & Draping',
  'Packages',
];

const ServiceIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'hd-bridal-makeup':
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
          <path
            d="M11 21L9 13L17 17L24 10L31 17L39 13L37 21C32.5 19.6 15.5 19.6 11 21Z"
            stroke="#E6CEB5"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="31" r="8.5" stroke="#C59B76" strokeWidth="1.3" />
          <path d="M20.5 30.5C22 29 26 29 27.5 30.5" stroke="#E6CEB5" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'bridal-event-packages':
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
          <rect x="9" y="13" width="30" height="24" rx="4" stroke="#C59B76" strokeWidth="1.35" />
          <path d="M9 21H39" stroke="#E6CEB5" strokeWidth="1.2" />
          <path d="M24 13V37" stroke="#E6CEB5" strokeWidth="1.2" />
          <path d="M18 13C18 9.5 22 8.5 24 13C26 8.5 30 9.5 30 13" stroke="#E6CEB5" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'party-makeup':
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
          <path d="M24 8L26.8 18.2L37 21L26.8 23.8L24 34L21.2 23.8L11 21L21.2 18.2L24 8Z" stroke="#E6CEB5" strokeWidth="1.35" strokeLinejoin="round" />
          <circle cx="35.5" cy="33.5" r="2.5" stroke="#C59B76" strokeWidth="1.2" />
          <circle cx="13" cy="12" r="1.8" fill="#C59B76" />
        </svg>
      );
    case 'professional-hair-styling':
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
          <path
            d="M14 34C15 21 20 12 28 12C35 12 38 19 36 27C34 34 26 37 21 33C17 30 19 23 25 22C29 21.5 31 24.5 29 28"
            stroke="#E6CEB5"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="16" r="2.2" stroke="#C59B76" strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
          <path d="M14 38C18 26 21 17 24 10C27 17 30 26 34 38" stroke="#E6CEB5" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M19 39C21 28 22.5 19 24 11M24 11C25.5 19 27 28 29 39M24 11V39" stroke="#C59B76" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M15.5 32.5C21 30.5 27 30.5 32.5 32.5" stroke="#E6CEB5" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  selectedServices,
  onToggleService,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<ServiceCategoryFilter>('All');

  const visibleServices = useMemo(() => {
    if (activeFilter === 'All') return ALL_SERVICES;
    return ALL_SERVICES.filter((svc) => svc.filterGroup === activeFilter);
  }, [activeFilter]);

  const bundleWhatsAppHref = buildWhatsAppUrl(
    `Hello Suzan (NS Makeover), I would like to inquire about: ${
      selectedServices.length > 0 ? selectedServices.join(', ') : 'your Bridal & Event Services'
    }. Please share availability and package details.`,
  );

  return (
    <section className="relative min-h-screen pt-32 pb-24 sm:pt-36 sm:pb-28 text-[#FAF6F2]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#231919]/82 via-[#231919]/68 to-[#231919]/75"
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

        {/* Header Row & Interactive Filter Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7 mb-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.28em] uppercase text-[#D8B491] mb-3">
              Complete Service Menu
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#FAF6F2] leading-[1.06]">
              Our Services Include
            </h1>
          </div>

          {/* Interactive Animated Filter Bar */}
          <div
            role="tablist"
            aria-label="Filter services by category"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#1A1212]/80 border border-[#C59B76]/28"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = activeFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(option)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-medium tracking-[0.12em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                    active ? 'text-[#231919]' : 'text-[#E6D9D1]/80 hover:text-[#FAF6F2]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="serviceFilterPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E6CEB5] to-[#C59B76]"
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Luxury Architectural Grid with Layout Animation */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-7">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, idx) => {
              const isSelected = selectedServices.includes(service.name);
              const spanClass =
                visibleServices.length === 5
                  ? idx < 2
                    ? 'md:col-span-3'
                    : 'md:col-span-2'
                  : visibleServices.length === 1
                  ? 'md:col-span-6'
                  : 'md:col-span-3';

              return (
                <motion.article
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={`${spanClass} group relative rounded-[24px] glass-espresso p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                    isSelected
                      ? 'border-[#E6CEB5]/75 shadow-[0_24px_56px_-20px_rgba(197,155,118,0.4)]'
                      : 'hover:border-[#C59B76]/55'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(420px circle at 20% 0%, rgba(197, 155, 118, 0.17), transparent 65%)',
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <ServiceIcon id={service.id} />
                      <div className="flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase text-[#D8B491]">
                        <span className="tabular-nums font-medium">{service.number}</span>
                        <span aria-hidden="true">·</span>
                        <span>{service.category}</span>
                      </div>
                    </div>

                    <h2 className="font-display text-2xl sm:text-[1.9rem] font-semibold text-[#FAF6F2] tracking-[0.01em] leading-snug mb-3">
                      {service.name}
                    </h2>

                    <p className="text-sm leading-[1.72] text-[#E6D9D1]/82 tracking-[0.01em] mb-4">
                      {service.description}
                    </p>

                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#C59B76]/90">
                      {service.idealFor}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 pt-5 border-t border-[#C59B76]/20 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleService(service.name)}
                      className={`inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors cursor-pointer py-1.5 whitespace-nowrap ${
                        isSelected
                          ? 'text-[#E6CEB5]'
                          : 'text-[#C59B76] hover:text-[#FAF6F2]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-[#E6CEB5]" />
                          <span>Selected for Booking</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Include in Booking</span>
                        </>
                      )}
                    </button>

                    <a
                      href={buildWhatsAppUrl(
                        `Hello Suzan (NS Makeover), I would like to inquire about ${service.name}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-[#E6D9D1]/80 hover:text-[#E6CEB5] transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#C59B76]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Interactive Selected Suite Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-12 rounded-[24px] glass-espresso p-7 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#D8B491] mb-1.5">
              Your Curated Selection · <span className="tabular-nums">{selectedServices.length}</span> Selected
            </p>
            <p className="text-sm text-[#EFE4DC]/90">
              {selectedServices.length > 0
                ? selectedServices.join('  ·  ')
                : 'Select one or more services above to build your personalized bridal or event suite.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={bundleWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] border border-[#C59B76]/55 hover:bg-[#C59B76]/15 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#E6CEB5]" />
              <span>Send Selection via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('/book')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer cursor-pointer whitespace-nowrap"
            >
              <span>Proceed to Booking Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
