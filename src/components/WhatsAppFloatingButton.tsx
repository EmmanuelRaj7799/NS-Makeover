import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl, STUDIO_CONTACT } from '../data/studioContent';

const WHATSAPP_PRESETS = [
  {
    label: 'Bridal Makeup Inquiry',
    text: 'Hello Suzan (NS Makeover), I would love to inquire about HD Bridal Makeup availability and packages.',
  },
  {
    label: 'Hairstyle & Saree Draping',
    text: 'Hello Suzan (NS Makeover), I am interested in Professional Hair Styling and Saree Draping for an upcoming event.',
  },
  {
    label: 'Complete Bridal Package',
    text: 'Hello Suzan (NS Makeover), please share details for your Bridal & Event Packages.',
  },
] as const;

export const WhatsAppFloatingButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const customHref = buildWhatsAppUrl(
    customNote.trim() ||
      'Hello Suzan (NS Makeover), I would like to book an appointment and learn more about your services.',
  );

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[min(340px,calc(100vw-2.5rem))] rounded-[22px] overflow-hidden border border-[#C59B76]/50 bg-[#231919] text-[#FAF6F2] shadow-[0_26px_64px_-16px_rgba(12,8,8,0.68)]"
          >
            <div className="px-5 py-4 border-b border-[#C59B76]/28 flex items-center justify-between gap-3 bg-[#2B1F1F]">
              <div>
                <p className="font-display text-lg font-semibold text-[#FAF6F2] leading-tight">
                  WhatsApp Direct Desk
                </p>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#E6CEB5]/85 tabular-nums">
                  Suzan · {STUDIO_CONTACT.phoneDisplay}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close WhatsApp quick panel"
                className="w-8 h-8 rounded-full border border-[#C59B76]/30 flex items-center justify-center text-[#E6CEB5] hover:bg-[#C59B76]/15 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-[#E6D9D1]/80 leading-relaxed">
                Start an instant WhatsApp conversation with Hema Suzan using a quick topic or your own message:
              </p>

              <div className="space-y-2">
                {WHATSAPP_PRESETS.map((preset) => (
                  <a
                    key={preset.label}
                    href={buildWhatsAppUrl(preset.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-[#C59B76]/30 bg-[#1B1313]/85 text-xs text-[#FAF6F2] hover:border-[#E6CEB5] hover:text-[#E6CEB5] transition-colors"
                  >
                    <span>{preset.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C59B76] shrink-0" />
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-[#C59B76]/20 space-y-2.5">
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Write a quick message for Suzan…"
                  aria-label="Custom WhatsApp message"
                  className="w-full rounded-xl bg-[#1A1212] border border-[#C59B76]/30 px-3.5 py-2.5 text-xs text-[#FAF6F2] placeholder:text-[#E6D9D1]/45 focus:outline-none focus:border-[#E6CEB5]"
                />
                <a
                  href={customHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium tracking-[0.12em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open in WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close WhatsApp direct desk' : 'Open WhatsApp direct chat with Suzan'}
        className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#FAF6F2] text-[#231919] border border-[#C59B76]/65 shadow-[0_16px_38px_-12px_rgba(35,25,25,0.45)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B76]"
      >
        <span className="w-8 h-8 rounded-full bg-[#231919] text-[#E6CEB5] flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4" />
        </span>
        <span className="text-xs font-medium tracking-[0.13em] uppercase whitespace-nowrap hidden sm:inline">
          WhatsApp
        </span>
      </motion.button>
    </div>
  );
};
