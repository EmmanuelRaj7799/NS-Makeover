import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { buildWhatsAppUrl, NAV_LINKS, PageRoute, STUDIO_CONTACT } from '../data/studioContent';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  onNavigate: (path: PageRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [parallax, setParallax] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const [crestFailed, setCrestFailed] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      rx: -ny * 10,
      ry: nx * 12,
      tx: nx * 16,
      ty: ny * 14,
    });
  };

  const handlePointerLeave = () => {
    setParallax({ rx: 0, ry: 0, tx: 0, ty: 0 });
  };

  const directoryPages = NAV_LINKS.filter((item) => item.path !== '/');

  return (
    <div className="relative">
      {/* Main Hero Stage */}
      <section className="relative min-h-[86vh] flex items-center pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Editorial Copy & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-[13px] font-medium tracking-[0.34em] uppercase text-[#8E5358] mb-5"
              >
                {STUDIO_CONTACT.tagline}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-semibold text-[#231919] tracking-[0.06em] leading-[0.98] text-[clamp(3rem,6.4vw,5.4rem)]"
              >
                NS MAKEOVER
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] w-36 my-7 mx-auto lg:mx-0 bg-gradient-to-r from-[#C59B76] via-[#9E5E63] to-transparent origin-left"
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto lg:mx-0"
              >
                <p className="font-script text-[clamp(2.25rem,4.2vw,3.45rem)] leading-[1.18] text-rose-gold-deep">
                  Make Every Occasion Beautiful
                </p>
                <p className="mt-2 font-display italic text-xl sm:text-2xl text-[#3E2C2C] tracking-[0.02em]">
                  with NS Makeover — bespoke bridal artistry, sculpted coiffure &amp; heirloom saree draping.
                </p>
              </motion.div>

              {/* Primary, Call & Direct WhatsApp Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5"
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/book')}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs sm:text-[13px] font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer shadow-[0_18px_38px_-14px_rgba(158,94,99,0.62)] cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E5E63]"
                >
                  <span>Book Your Appointment Today!</span>
                  <ArrowDownRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </motion.button>

                <a
                  href={STUDIO_CONTACT.phoneHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-xs sm:text-[13px] font-medium tracking-[0.12em] uppercase text-[#231919] bg-[#FAF6F2]/92 border border-[#C59B76]/55 hover:border-[#9E5E63] hover:text-[#9E5E63] transition-colors duration-200 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-[#9E5E63]" />
                  <span className="tabular-nums">Call {STUDIO_CONTACT.phoneDisplay}</span>
                </a>

                <a
                  href={buildWhatsAppUrl(
                    'Hello Suzan (NS Makeover), I visited your website and would love to inquire about bridal & makeover bookings.',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xs sm:text-[13px] font-medium tracking-[0.12em] uppercase text-[#7C444A] bg-[#F4E9E1]/90 border border-[#C59B76]/45 hover:border-[#9E5E63] hover:bg-[#FAF6F2] transition-colors duration-200 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#9E5E63]" />
                  <span>WhatsApp Suzan</span>
                </a>
              </motion.div>

              {/* Clickable Unboxed Quick Route Links */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 pt-6 border-t border-[#C59B76]/28 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs tracking-[0.14em] uppercase text-[#5C4545]"
              >
                <button
                  type="button"
                  onClick={() => onNavigate('/specialties')}
                  className="hover:text-[#9E5E63] transition-colors cursor-pointer"
                >
                  HD Bridal Artistry
                </button>
                <span aria-hidden="true" className="text-[#C59B76]">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-[#9E5E63] transition-colors cursor-pointer"
                >
                  5 Signature Services
                </button>
                <span aria-hidden="true" className="text-[#C59B76]">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/founders')}
                  className="hover:text-[#9E5E63] transition-colors cursor-pointer"
                >
                  Naveen &amp; Hema Suzan
                </button>
              </motion.div>
            </div>

            {/* 3D Depth Parallax Couture Crest Stage */}
            <motion.div
              ref={stageRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              <div
                className="relative w-[300px] h-[300px] sm:w-[390px] sm:h-[390px] lg:w-[440px] lg:h-[440px] flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${parallax.rx}deg) rotateY(${parallax.ry}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Gently Rotating Rose-Gold Orbital Halos */}
                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-[#C59B76]/45"
                  style={{
                    transform: `translateZ(-36px) translate3d(${-parallax.tx * 0.6}px, ${-parallax.ty * 0.6}px, 0)`,
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-dashed border-[#9E5E63]/38"
                  style={{
                    transform: `translateZ(-16px) translate3d(${parallax.tx * 0.35}px, ${parallax.ty * 0.35}px, 0)`,
                  }}
                />

                {/* Central Floating Medallion housing the Official NS Makeover Crest */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-[82%] h-[82%] rounded-full p-2.5 glass-ivory flex items-center justify-center overflow-hidden"
                  style={{
                    transform: 'translateZ(26px)',
                    boxShadow:
                      '0 32px 70px -26px rgba(35, 25, 25, 0.25), 0 0 0 1px rgba(197, 155, 118, 0.42)',
                  }}
                >
                  {!crestFailed ? (
                    <img
                      src={STUDIO_CONTACT.crestImagePath}
                      alt="NS Makeover — Beauty, Elegance, Perfection rose-gold royal crown crest"
                      referrerPolicy="no-referrer"
                      onError={() => setCrestFailed(true)}
                      className="w-full h-full object-cover rounded-full scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FAF6F2] to-[#EDE1D8] flex flex-col items-center justify-center p-6 text-center">
                      <BrandLogo variant="light" />
                      <p className="mt-3 text-[11px] tracking-[0.26em] uppercase text-[#8E5358]">
                        {STUDIO_CONTACT.tagline}
                      </p>
                    </div>
                  )}
                </motion.div>

                <span
                  aria-hidden="true"
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C59B76]"
                  style={{ transform: 'translateZ(42px)' }}
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#9E5E63]"
                  style={{ transform: 'translateZ(42px)' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Separate-Page Atelier Directory */}
      <section className="relative pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium tracking-[0.26em] uppercase text-[#8E5358] mb-2">
                Explore NS Makeover
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#231919]">
                Step Into Each Dedicated Experience
              </h2>
            </div>
            <p className="text-xs tracking-[0.14em] uppercase text-[#6A5050]">
              Select any heading to open its full page
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {directoryPages.map((page, index) => (
              <motion.button
                key={page.path}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => onNavigate(page.path)}
                className="group text-left rounded-[22px] glass-ivory p-7 flex flex-col justify-between min-h-[210px] cursor-pointer hover:border-[#9E5E63]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B76]"
              >
                <div>
                  <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#8C5257] mb-3">
                    {page.tagline}
                  </p>
                  <h3 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#231919] group-hover:text-[#9E5E63] transition-colors">
                    {page.label}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-[13px] leading-[1.68] text-[#554040]">
                    {page.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C59B76]/25 flex items-center justify-between text-xs font-medium tracking-[0.14em] uppercase text-[#8C4D53]">
                  <span>Open Page</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
