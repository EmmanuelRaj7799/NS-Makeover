import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { buildWhatsAppUrl, NAV_LINKS, PageRoute, STUDIO_CONTACT } from '../data/studioContent';

interface FooterProps {
  onNavigate: (path: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const year = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: PageRoute) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="relative bg-[#191111] text-[#FAF6F2] border-t border-[#C59B76]/24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">
        {/* Signature Editorial Quote */}
        <div className="text-center max-w-3xl mx-auto pb-12 mb-12 border-b border-[#C59B76]/20">
          <p className="font-script text-4xl sm:text-5xl text-rose-gold-gradient leading-snug mb-3">
            “{STUDIO_CONTACT.quote}”
          </p>
          <p className="text-xs tracking-[0.26em] uppercase text-[#D8B491]/85">
            {STUDIO_CONTACT.tagline}
          </p>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand & Founders Credit */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-block"
              aria-label="NS Makeover Home"
            >
              <BrandLogo variant="dark" compact />
            </a>
            <p className="text-sm leading-[1.75] text-[#E6D9D1]/78 max-w-sm">
              Make every occasion beautiful with NS Makeover — luxury bridal makeup, sculpted hairstyling, and professional saree draping.
            </p>
            <p className="text-xs tracking-[0.16em] uppercase text-[#D8B491]">
              Founded by Naveen &amp; Hema Suzan
            </p>
          </div>

          {/* Dedicated Page Links */}
          <div className="md:col-span-3">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#D8B491] mb-4">
              Explore Pages
            </p>
            <nav aria-label="Footer Navigation" className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className="text-sm text-[#E6D9D1]/80 hover:text-[#E6CEB5] transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Direct Contact & WhatsApp */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-[#D8B491]">
              Direct Reservations
            </p>
            <p className="text-sm text-[#E6D9D1]/80">
              Contact{' '}
              <span className="text-[#FAF6F2] font-medium">{STUDIO_CONTACT.contactPerson}</span>
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={STUDIO_CONTACT.phoneHref}
                className="inline-flex items-center gap-2.5 text-base font-display text-[#FAF6F2] hover:text-[#E6CEB5] transition-colors tabular-nums w-fit"
              >
                <Phone className="w-4 h-4 text-[#C59B76]" />
                <span>{STUDIO_CONTACT.phoneDisplay}</span>
              </a>
              <a
                href={buildWhatsAppUrl(
                  'Hello Suzan (NS Makeover), I would love to inquire about booking an appointment.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-xs tracking-[0.14em] uppercase text-[#D8B491] hover:text-[#FAF6F2] transition-colors w-fit"
              >
                <MessageCircle className="w-4 h-4 text-[#C59B76]" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Creator Attribution */}
        <div className="mt-14 pt-6 border-t border-[#C59B76]/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#E6D9D1]/65">
          <p>© {year} NS Makeover. All rights reserved.</p>
          <p className="text-[#E6CEB5]/90 tracking-[0.1em] font-medium">
            {STUDIO_CONTACT.creatorCredit}
          </p>
          <p>Founders: Naveen &amp; Hema Suzan · {STUDIO_CONTACT.phoneDisplay}</p>
        </div>
      </div>
    </footer>
  );
};
