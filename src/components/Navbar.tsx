import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { NAV_LINKS, PageRoute } from '../data/studioContent';

interface NavbarProps {
  scrollProgress: number;
  activeRoute: PageRoute;
  isDarkTheme: boolean;
  onNavigate: (path: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scrollProgress,
  activeRoute,
  isDarkTheme,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleRouteClick = (e: React.MouseEvent<HTMLAnchorElement>, path: PageRoute) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      {/* Rose-Gold Scroll Progress Indicator */}
      <div className="h-[2.5px] w-full bg-transparent overflow-hidden" aria-hidden="true">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#9E5E63] via-[#E6CEB5] to-[#C59B76]"
          style={{
            transform: `scaleX(${Math.max(0.04, Math.min(1, scrollProgress))})`,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Floating Glassmorphic 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div
          className={`flex items-center justify-between gap-8 px-5 sm:px-7 py-3 rounded-2xl transition-colors duration-500 ${
            isDarkTheme
              ? 'bg-[#231919]/92 border border-[#C59B76]/28 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.75)]'
              : 'bg-[#FAF6F2]/92 border border-[#C59B76]/35 shadow-[0_14px_36px_-18px_rgba(35,25,25,0.16)]'
          }`}
        >
          {/* Zone 1: NS Makeover Crown Logo */}
          <a
            href="/"
            onClick={(e) => handleRouteClick(e, '/')}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B76] rounded-lg"
            aria-label="NS Makeover Home"
          >
            <BrandLogo variant={isDarkTheme ? 'dark' : 'light'} compact />
          </a>

          {/* Zone 2: Dedicated Multi-Page Navigation Links with Animated Active Underline */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeRoute === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleRouteClick(e, link.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-xs font-medium tracking-[0.16em] uppercase whitespace-nowrap shrink-0 py-1.5 transition-colors duration-200 ${
                    isActive
                      ? isDarkTheme
                        ? 'text-[#E6CEB5]'
                        : 'text-[#9E5E63]'
                      : isDarkTheme
                      ? 'text-[#EFE4DC]/80 hover:text-[#E6CEB5]'
                      : 'text-[#3C2B2B]/80 hover:text-[#9E5E63]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-gradient-to-r from-[#9E5E63] via-[#E6CEB5] to-[#C59B76]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/book"
              onClick={(e) => handleRouteClick(e, '/book')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.12em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer shadow-[0_10px_24px_-10px_rgba(158,94,99,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B76]"
            >
              Book Appointment
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
                isDarkTheme
                  ? 'border-[#C59B76]/35 text-[#FAF6F2] hover:bg-[#C59B76]/15'
                  : 'border-[#C59B76]/45 text-[#231919] hover:bg-[#C59B76]/15'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Page Navigation Drawer */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden mt-2.5 rounded-2xl p-5 border transition-colors ${
              isDarkTheme
                ? 'bg-[#281D1D]/96 border-[#C59B76]/30 text-[#FAF6F2]'
                : 'bg-[#FAF6F2]/96 border-[#C59B76]/38 text-[#231919]'
            } shadow-2xl`}
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeRoute === link.path;
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => handleRouteClick(e, link.path)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-3 rounded-xl text-xs font-medium tracking-[0.16em] uppercase transition-colors ${
                      isActive
                        ? 'bg-[#C59B76]/20 text-[#C59B76]'
                        : isDarkTheme
                        ? 'text-[#EFE4DC] hover:bg-[#C59B76]/12 hover:text-[#E6CEB5]'
                        : 'text-[#2C1E1E] hover:bg-[#9E5E63]/10 hover:text-[#9E5E63]'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#C59B76]/25">
                <a
                  href="/book"
                  onClick={(e) => handleRouteClick(e, '/book')}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer"
                >
                  Book Appointment
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};
