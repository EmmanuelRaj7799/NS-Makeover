import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import {
  buildWhatsAppUrl,
  CONCIERGE_SUGGESTIONS,
  PageRoute,
  STUDIO_CONTACT,
} from '../data/studioContent';

interface BridalChatbotProps {
  onNavigate: (path: PageRoute) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isWelcome?: boolean;
  isError?: boolean;
}

const INITIAL_WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'model',
  isWelcome: true,
  text: 'Welcome to NS Makeover. I am your NS Bridal Concierge—ask me about our HD bridal makeup, hairstyles, saree draping, packages, founders, or booking your special date.',
};

function renderFormattedLine(line: string, lineIndex: number) {
  const isBullet = /^\s*[-*•]\s+/.test(line);
  const cleanLine = isBullet ? line.replace(/^\s*[-*•]\s+/, '') : line;
  const segments = cleanLine.split(/(\*\*[^*]+\*\*)/g);

  const content = segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#231919]">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });

  if (isBullet) {
    return (
      <div key={lineIndex} className="flex items-start gap-2 pl-1">
        <span aria-hidden="true" className="text-[#9E5E63] mt-0.5">
          •
        </span>
        <span className="flex-1">{content}</span>
      </div>
    );
  }

  return (
    <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
      {content}
    </p>
  );
}

export const BridalChatbot: React.FC<BridalChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Exclude the local welcome banner and any error notices so Gemini always begins with a 'user' turn
      const apiMessages = nextHistory
        .filter((m) => !m.isWelcome && !m.isError)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Live AI Concierge requires a backend server (static hosts like GitHub Pages cannot run /api routes). You can reach Hema Suzan directly on WhatsApp at +91 63005 64531 or use our Book Now page.',
        );
      }

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(
          data.error ||
            'Our concierge is momentarily busy. Please message Hema Suzan directly on WhatsApp at +91 63005 64531.',
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply!,
        },
      ]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unable to connect right now. Please message Suzan on WhatsApp at +91 63005 64531.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    if (isLoading) return;
    setMessages([INITIAL_WELCOME]);
    setInputValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendPrompt(inputValue);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            aria-label="NS Bridal Concierge Chat"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3.5 w-[min(400px,calc(100vw-2.25rem))] rounded-[24px] overflow-hidden border border-[#C59B76]/55 bg-[#FAF6F2] text-[#231919] shadow-[0_28px_70px_-18px_rgba(20,12,12,0.55)] flex flex-col max-h-[min(600px,78vh)]"
          >
            {/* Concierge Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#231919] via-[#2F2122] to-[#231919] text-[#FAF6F2] border-b border-[#C59B76]/35 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full border border-[#C59B76]/55 bg-[#C59B76]/15 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 28 20" className="w-5 h-3.5" fill="none" aria-hidden="true">
                    <path
                      d="M4 16L2 6L9 10L14 3L19 10L26 6L24 16C20 15 8 15 4 16Z"
                      stroke="#E6CEB5"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold tracking-[0.04em] text-[#FAF6F2] truncate">
                    NS Bridal Concierge
                  </h2>
                  <p className="text-[11px] tracking-[0.14em] uppercase text-[#E6CEB5]/85 truncate">
                    NS Makeover Private Advisor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Restart conversation"
                  aria-label="Restart conversation"
                  className="w-8 h-8 rounded-full border border-[#C59B76]/30 flex items-center justify-center text-[#E6CEB5] hover:bg-[#C59B76]/15 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close NS Bridal Concierge"
                  className="w-8 h-8 rounded-full border border-[#C59B76]/30 flex items-center justify-center text-[#E6CEB5] hover:bg-[#C59B76]/15 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Strip inside Concierge */}
            <div className="px-4 py-2.5 bg-[#F4EBE4] border-b border-[#C59B76]/25 flex items-center justify-between gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('/book');
                }}
                className="inline-flex items-center gap-1.5 font-medium tracking-[0.08em] uppercase text-[#7C444A] hover:text-[#231919] transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
              <a
                href={buildWhatsAppUrl(
                  'Hello Suzan (NS Makeover), I was chatting with the NS Bridal Concierge and would love to discuss my booking.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium tracking-[0.08em] uppercase text-[#7C444A] hover:text-[#231919] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Suzan</span>
              </a>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#FAF6F2]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const lines = msg.text.split('\n').filter((line) => line.trim().length > 0);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-[1.62] ${
                        isUser
                          ? 'bg-[#231919] text-[#FAF6F2] rounded-br-sm'
                          : msg.isError
                          ? 'bg-[#F4E4E6] border border-[#9E5E63]/40 text-[#5C292F] rounded-bl-sm'
                          : 'bg-[#FFFFFF] border border-[#C59B76]/32 text-[#2E2121] rounded-bl-sm shadow-[0_6px_18px_-12px_rgba(35,25,25,0.2)]'
                      }`}
                    >
                      {isUser ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div className="space-y-1">
                          {lines.map((line, i) => renderFormattedLine(line, i))}
                        </div>
                      )}
                      {msg.isError && (
                        <a
                          href={STUDIO_CONTACT.whatsappBaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#8C4D53] underline underline-offset-4"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Message Suzan ({STUDIO_CONTACT.phoneDisplay})</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white border border-[#C59B76]/30 px-4 py-3 text-xs text-[#8C5358] tracking-[0.06em]">
                    Composing your reply…
                  </div>
                </div>
              )}

              {/* Quick-Reply Suggestion Chips */}
              <div className="pt-2">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#8C5358] mb-2">
                  Quick Questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONCIERGE_SUGGESTIONS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendPrompt(chip)}
                      className="text-left text-[11.5px] px-3 py-1.5 rounded-xl border border-[#C59B76]/45 bg-[#F5ECE5] text-[#3B2828] hover:border-[#9E5E63] hover:text-[#9E5E63] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={scrollEndRef} />
            </div>

            {/* Composer Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3.5 border-t border-[#C59B76]/28 bg-[#F6EFE9] flex items-center gap-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about bridal packages, dates…"
                aria-label="Message NS Bridal Concierge"
                className="flex-1 min-w-0 rounded-full bg-white border border-[#C59B76]/40 px-4 py-2.5 text-xs sm:text-[13px] text-[#231919] placeholder:text-[#7D6666] focus:outline-none focus:border-[#9E5E63]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-rose-gold-shimmer text-[#FAF6F2] flex items-center justify-center shrink-0 disabled:opacity-45 cursor-pointer transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Minimize NS Bridal Concierge' : 'Open NS Bridal Concierge'}
        className="group inline-flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-[#231919] text-[#FAF6F2] border border-[#C59B76]/60 shadow-[0_18px_40px_-12px_rgba(20,12,12,0.65)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6CEB5]"
      >
        <span className="w-8 h-8 rounded-full bg-rose-gold-shimmer flex items-center justify-center shrink-0">
          {isOpen ? (
            <X className="w-4 h-4 text-[#FAF6F2]" />
          ) : (
            <svg viewBox="0 0 28 20" className="w-4 h-3" fill="none" aria-hidden="true">
              <path
                d="M4 16L2 6L9 10L14 3L19 10L26 6L24 16C20 15 8 15 4 16Z"
                stroke="#FAF6F2"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="text-xs font-medium tracking-[0.14em] uppercase whitespace-nowrap">
          NS Bridal Concierge
        </span>
      </motion.button>
    </div>
  );
};
